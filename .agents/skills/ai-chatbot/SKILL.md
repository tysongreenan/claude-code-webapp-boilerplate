---
name: ai-chatbot
description: RAG-powered AI chatbot patterns. Use when working with embeddings, Pinecone, OpenAI, or the chat widget.
---

# AI Chatbot — RAG Pipeline

## Architecture

```
User question → OpenAI embed → Pinecone search → top 5 chunks → OpenAI chat → answer
```

## Key Files
- `convex/ai.ts` — All AI logic (ingest, chat, document management)
- `convex/schema.ts` — knowledgeDocuments, knowledgeChunks, chatConversations, chatMessages
- `components/chat/chat-widget.tsx` — Floating chat UI component

## Ingest Pipeline
1. User provides text content (page, FAQ, docs)
2. `ai.ingest` action chunks text (~2000 chars, sentence boundary aware)
3. OpenAI generates embeddings (`text-embedding-3-small`)
4. Vectors upserted to Pinecone with metadata
5. Chunks saved to Convex for retrieval display

## Chat Pipeline
1. User asks a question
2. Question embedded via OpenAI
3. Pinecone returns top 5 similar chunks
4. Chunks assembled as context for GPT-4o-mini
5. Answer returned + conversation saved in Convex

## Convex Env Vars Needed
```bash
npx convex env set OPENAI_API_KEY sk-...
npx convex env set PINECONE_API_KEY ...
npx convex env set PINECONE_INDEX knowledge
```

## Pinecone Index Setup
- Create index named "knowledge" in Pinecone dashboard
- Dimension: 1536 (matches text-embedding-3-small)
- Metric: cosine

## Best Practices
1. Chunk at sentence boundaries, not arbitrary character limits
2. Include overlap between chunks (200 chars) for context continuity
3. Store chunk text in Pinecone metadata for fast retrieval
4. Use `gpt-4o-mini` for chat (fast + cheap), `text-embedding-3-small` for embeddings
5. Conversations are real-time via Convex — messages appear instantly
