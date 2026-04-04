/**
 * AI Chat API — Streaming RAG endpoint powered by Vercel AI SDK
 *
 * Uses AI SDK for both chat (streamText) and embeddings (embed).
 * Model calls route through Vercel AI Gateway (OIDC on Vercel, API key locally).
 * Pinecone requires its own API key (not behind AI Gateway).
 */

import { streamText, embed, convertToModelMessages, UIMessage } from "ai"
import { Pinecone } from "@pinecone-database/pinecone"

export const maxDuration = 30

async function getRAGContext(question: string): Promise<string> {
  try {
    // Embed the question using AI SDK (routes through AI Gateway on Vercel)
    const { embedding } = await embed({
      model: "openai/text-embedding-3-small",
      value: question,
    })

    // Search Pinecone for relevant chunks
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
    const index = pinecone.index(process.env.PINECONE_INDEX || "knowledge")

    const results = await index.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    })

    const chunks = results.matches
      ?.map((m) => (m.metadata as any)?.text || "")
      .filter(Boolean) || []

    return chunks.length > 0
      ? chunks.join("\n\n---\n\n")
      : "No relevant information found in the knowledge base."
  } catch (error) {
    console.error("[AI Chat] RAG context error:", error)
    return "Knowledge base is not configured yet."
  }
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  // Extract latest user message for RAG search
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
  const question = lastUserMessage?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ") || ""

  const context = await getRAGContext(question)

  const systemPrompt = `You are a helpful AI assistant for this website/product. Answer questions based on the provided context from our knowledge base. If the context doesn't contain relevant information, say so honestly and offer to help in other ways. Be concise, friendly, and helpful.

Context from knowledge base:
${context}`

  // AI Gateway string model ID — auto-routes through gateway on Vercel
  const result = streamText({
    model: "openai/gpt-4o-mini", // Change to "openai/gpt-5.4" when available on your plan
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
