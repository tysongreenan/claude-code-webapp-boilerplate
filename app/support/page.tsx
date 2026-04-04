import Link from "next/link"
import { getArticlesByCategory } from "@/lib/support"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Support Center",
  description: "Find answers to common questions about our product.",
}

export default function SupportPage() {
  const grouped = getArticlesByCategory()
  const categories = Object.entries(grouped)

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-heading font-bold mb-2">Support Center</h1>
        <p className="text-muted-foreground mb-12">
          Find answers to common questions. Can't find what you need? Ask the AI chatbot in the bottom-right corner.
        </p>

        {categories.length === 0 ? (
          <p className="text-muted-foreground">No support articles yet.</p>
        ) : (
          <div className="space-y-10">
            {categories.map(([category, articles]) => (
              <section key={category}>
                <h2 className="text-xl font-heading font-semibold mb-4 pb-2 border-b border-border">
                  {articles[0]?.categoryLabel || category}
                </h2>
                <div className="space-y-3">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/support/${article.slug}`}
                      className="block group"
                    >
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{article.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
