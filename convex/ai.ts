/**
 * AI Knowledge Base — Ingest, Embed, and Chat
 *
 * Pipeline:
 * 1. User adds a document (page URL, text, FAQ)
 * 2. `ingest` action chunks the text and generates embeddings via OpenAI
 * 3. Embeddings stored in Pinecone, chunks stored in Convex
 * 4. `chat` action takes a question, finds relevant chunks via Pinecone, answers via OpenAI
 */

import { action, mutation, query, internalMutation } from "./_generated/server"
import { v } from "convex/values"
import { internal } from "./_generated/api"
import { getCurrentUser } from "./model/auth"
import OpenAI from "openai"
import { Pinecone } from "@pinecone-database/pinecone"

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

function getPinecone() {
  return new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
}

const PINECONE_INDEX = process.env.PINECONE_INDEX || "knowledge"
const CHUNK_SIZE = 500 // tokens (approx)
const CHUNK_OVERLAP = 50

// ── Chunking helper ─────────────────────────────────────

function chunkText(text: string, maxChars = 2000, overlap = 200): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    let end = start + maxChars

    // Try to break at a sentence boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf(". ", end)
      const lastNewline = text.lastIndexOf("\n", end)
      const breakPoint = Math.max(lastPeriod, lastNewline)
      if (breakPoint > start + maxChars / 2) {
        end = breakPoint + 1
      }
    }

    chunks.push(text.slice(start, end).trim())
    start = end - overlap
  }

  return chunks.filter((c) => c.length > 20)
}

// ── Ingest a document ───────────────────────────────────

export const ingest = action({
  args: {
    title: v.string(),
    content: v.string(),
    sourceUrl: v.optional(v.string()),
    sourceType: v.string(),
    teamId: v.optional(v.id("teams")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    // Save document
    const docId = await ctx.runMutation(internal.ai.saveDocument, {
      title: args.title,
      content: args.content,
      sourceUrl: args.sourceUrl,
      sourceType: args.sourceType,
      teamId: args.teamId,
      tokenIdentifier: identity.tokenIdentifier,
    })

    // Chunk the text
    const chunks = chunkText(args.content)

    // Generate embeddings for all chunks
    const openai = getOpenAI()
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks,
    })

    // Upsert to Pinecone
    const pinecone = getPinecone()
    const index = pinecone.index(PINECONE_INDEX)

    const vectors = embeddingResponse.data.map((item, i) => ({
      id: `${docId}_${i}`,
      values: item.embedding,
      metadata: {
        documentId: docId,
        chunkIndex: i,
        text: chunks[i].slice(0, 1000), // Pinecone metadata limit
        title: args.title,
        sourceType: args.sourceType,
      },
    }))

    await index.upsert(vectors)

    // Save chunks to Convex
    for (let i = 0; i < chunks.length; i++) {
      await ctx.runMutation(internal.ai.saveChunk, {
        documentId: docId,
        chunkIndex: i,
        text: chunks[i],
        pineconeId: `${docId}_${i}`,
        tokenCount: Math.ceil(chunks[i].length / 4), // rough estimate
      })
    }

    return { documentId: docId, chunksCreated: chunks.length }
  },
})

// ── Chat with the knowledge base ────────────────────────

export const chat = action({
  args: {
    question: v.string(),
    conversationId: v.optional(v.id("chatConversations")),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Embed the question
    const openai = getOpenAI()
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: [args.question],
    })
    const queryVector = embeddingResponse.data[0].embedding

    // Search Pinecone for relevant chunks
    const pinecone = getPinecone()
    const index = pinecone.index(PINECONE_INDEX)

    const searchResults = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    })

    const relevantChunks = searchResults.matches
      ?.map((m) => (m.metadata as any)?.text || "")
      .filter(Boolean) || []

    // Build context for the LLM
    const context = relevantChunks.join("\n\n---\n\n")

    const systemPrompt = `You are a helpful AI assistant for this website/product. Answer questions based on the provided context. If you don't know the answer from the context, say so honestly. Be concise and helpful.

Context from the knowledge base:
${context}`

    // Generate answer
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: args.question },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const answer = completion.choices[0]?.message?.content || "Sorry, I couldn't generate an answer."

    // Save the conversation
    let conversationId = args.conversationId
    if (!conversationId) {
      conversationId = await ctx.runMutation(internal.ai.createConversation, {
        sessionId: args.sessionId,
      })
    }

    await ctx.runMutation(internal.ai.saveMessage, {
      conversationId,
      role: "user",
      content: args.question,
    })

    await ctx.runMutation(internal.ai.saveMessage, {
      conversationId,
      role: "assistant",
      content: answer,
    })

    return { answer, conversationId }
  },
})

// ── List documents ──────────────────────────────────────

export const listDocuments = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []
    return await ctx.db
      .query("knowledgeDocuments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
  },
})

// ── Get conversation messages ───────────────────────────

export const getMessages = query({
  args: { conversationId: v.id("chatConversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect()
  },
})

// ── Internal mutations ──────────────────────────────────

export const saveDocument = internalMutation({
  args: {
    title: v.string(),
    content: v.string(),
    sourceUrl: v.optional(v.string()),
    sourceType: v.string(),
    teamId: v.optional(v.id("teams")),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique()
    if (!user) throw new Error("User not found")

    return await ctx.db.insert("knowledgeDocuments", {
      title: args.title,
      content: args.content,
      sourceUrl: args.sourceUrl,
      sourceType: args.sourceType,
      teamId: args.teamId,
      userId: user._id,
    })
  },
})

export const saveChunk = internalMutation({
  args: {
    documentId: v.id("knowledgeDocuments"),
    chunkIndex: v.number(),
    text: v.string(),
    pineconeId: v.string(),
    tokenCount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("knowledgeChunks", args)
  },
})

export const createConversation = internalMutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatConversations", {
      sessionId: args.sessionId,
    })
  },
})

export const saveMessage = internalMutation({
  args: {
    conversationId: v.id("chatConversations"),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", args)
  },
})
