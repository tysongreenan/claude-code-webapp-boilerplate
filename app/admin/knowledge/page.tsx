"use client"

import { useState } from "react"
import { useQuery, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

/**
 * Knowledge Base Manager — feed your AI chatbot
 *
 * Add content here and it gets chunked, embedded, and stored in Pinecone.
 * The chatbot then uses this content to answer user questions.
 *
 * Ways to add content:
 * 1. Paste text directly (FAQs, product descriptions, docs)
 * 2. Provide a title and content for each document
 * 3. (Future) URL scraper, file upload, blog auto-ingest
 */
export default function KnowledgePage() {
  const documents = useQuery(api.ai.listDocuments)
  const ingest = useAction(api.ai.ingest)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [sourceType, setSourceType] = useState("doc")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleIngest(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const res = await ingest({
        title: title.trim(),
        content: content.trim(),
        sourceType,
      })
      setResult(`Ingested "${title}" — ${res.chunksCreated} chunks created`)
      setTitle("")
      setContent("")
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : "Failed to ingest"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded font-medium">Admin</span>
          </div>
          <Link href="/admin">
            <Button variant="ghost" size="sm">&larr; Admin Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-heading font-bold mb-2">Knowledge Base</h1>
        <p className="text-muted-foreground mb-8">
          Add content here to teach your AI chatbot about your product. Paste FAQs, docs, product descriptions — anything your users might ask about.
        </p>

        {/* Ingest form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Content</CardTitle>
            <CardDescription>
              Paste text content. It will be automatically chunked, embedded, and stored for the AI chatbot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIngest} className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Document title (e.g. 'Pricing FAQ')"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="doc">Documentation</option>
                  <option value="faq">FAQ</option>
                  <option value="page">Web Page</option>
                  <option value="blog">Blog Post</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <textarea
                placeholder="Paste your content here... The AI will learn from this text and use it to answer user questions."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-y"
              />

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {content.length > 0 ? `${content.length} chars — ~${Math.ceil(content.length / 2000)} chunks` : ""}
                </p>
                <Button type="submit" disabled={loading || !title.trim() || !content.trim()}>
                  {loading ? "Ingesting..." : "Add to Knowledge Base"}
                </Button>
              </div>

              {result && (
                <p className={`text-sm ${result.startsWith("Error") ? "text-destructive" : "text-primary"}`}>
                  {result}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Existing documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents ({documents?.length || 0})</CardTitle>
            <CardDescription>Content your AI chatbot knows about</CardDescription>
          </CardHeader>
          <CardContent>
            {!documents || documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents yet. Add content above to teach your chatbot.
              </p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.sourceType} — {doc.content.length} chars
                        {doc.sourceUrl && ` — ${doc.sourceUrl}`}
                      </p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                      {doc.sourceType}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
