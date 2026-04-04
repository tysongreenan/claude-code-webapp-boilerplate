/**
 * AI Knowledge Base — Ingest and Embed
 *
 * Handles document ingestion and embedding storage.
 * Chat is handled by /api/ai/chat (AI SDK streaming route).
 *
 * Pipeline:
 * 1. User adds a document (page URL, text, FAQ)
 * 2. `ingest` action chunks the text and generates embeddings via OpenAI
 * 3. Embeddings stored in Pinecone, chunks stored in Convex
 */

import { action, query, internalMutation } from "./_generated/server"
import { v } from "convex/values"
import { internal } from "./_generated/api"
import { getCurrentUser } from "./model/auth"
import OpenAI from "openai"
import { Pinecone } from "@pinecone-database/pinecone"

// Note: Convex actions use OpenAI SDK directly for embeddings during ingestion.
// Chat uses AI SDK streaming in /api/ai/chat (Next.js route).
function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

function getPinecone() {
  return new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
}

const PINECONE_INDEX = process.env.PINECONE_INDEX || "knowledge"

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

