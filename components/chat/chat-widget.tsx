"use client"

import { useState, useRef, useEffect } from "react"
import { useAction, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"

/**
 * AI Chat Widget — drop this on any page for RAG-powered support
 *
 * Usage:
 *   <ChatWidget />
 *
 * Features:
 * - Floating chat bubble in bottom-right corner
 * - Real-time message history via Convex
 * - RAG answers from your knowledge base
 * - Works for anonymous visitors (session-based)
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<Id<"chatConversations"> | null>(null)
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return "server"
    return sessionStorage.getItem("chat-session") || (() => {
      const id = crypto.randomUUID()
      sessionStorage.setItem("chat-session", id)
      return id
    })()
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chat = useAction(api.ai.chat)
  const messages = useQuery(
    api.ai.getMessages,
    conversationId ? { conversationId } : "skip"
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const question = input.trim()
    setInput("")
    setLoading(true)

    try {
      const result = await chat({
        question,
        conversationId: conversationId || undefined,
        sessionId,
      })

      if (result.conversationId && !conversationId) {
        setConversationId(result.conversationId)
      }
    } catch (err) {
      console.error("Chat error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg",
          "flex items-center justify-center hover:scale-105 transition-transform"
        )}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[500px] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3">
            <p className="font-semibold text-sm">AI Assistant</p>
            <p className="text-xs opacity-80">Ask anything about our product</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[340px]">
            {!messages || messages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center mt-8">
                Hi! Ask me anything about the product.
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={cn(
                    "text-sm rounded-lg px-3 py-2 max-w-[85%]",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.content}
                </div>
              ))
            )}
            {loading && (
              <div className="bg-muted text-foreground text-sm rounded-lg px-3 py-2 max-w-[85%] animate-pulse">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-border p-3 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 text-sm"
              disabled={loading}
            />
            <Button type="submit" size="sm" disabled={loading || !input.trim()}>
              Send
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
