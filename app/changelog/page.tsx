import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new — latest updates, features, and improvements.",
}

const ENTRIES = [
  {
    date: "2026-04-04",
    version: "2.0.0",
    title: "Launch",
    type: "release" as const,
    items: [
      "Auth with Clerk (email + Google OAuth)",
      "Stripe payments (checkout, subscriptions, portal)",
      "AI chatbot with RAG (Pinecone + AI SDK streaming)",
      "Admin dashboard with real-time stats",
      "Knowledge base manager",
      "Support center CMS (8 articles)",
      "Account settings (profile, billing, team, danger zone)",
      "63 UI components + 105 block templates",
      "PostHog analytics + Sentry error tracking",
      "5 slash commands for Claude Code",
      "Blog with full SEO/AEO (structured data, TOC, FAQ schema)",
    ],
  },
]

const TYPE_COLORS = {
  release: "bg-primary text-primary-foreground",
  feature: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  fix: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  improvement: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-heading font-bold mb-2">Changelog</h1>
        <p className="text-muted-foreground mb-12">What&apos;s new and improved.</p>

        <div className="space-y-12">
          {ENTRIES.map((entry) => (
            <article key={entry.version} className="relative pl-8 border-l-2 border-border">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background" />
              <div className="flex items-center gap-3 mb-3">
                <time className="text-sm text-muted-foreground">{entry.date}</time>
                <Badge className={TYPE_COLORS[entry.type]}>{entry.version}</Badge>
              </div>
              <h2 className="text-xl font-heading font-semibold mb-3">{entry.title}</h2>
              <ul className="space-y-1.5">
                {entry.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
