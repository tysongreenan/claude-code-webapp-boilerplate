import { notFound } from "next/navigation"
import Link from "next/link"
import { getArticleBySlug, getAllArticles } from "@/lib/support"
import type { Metadata } from "next"

interface Props {
  params: { slug: string[] }
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((a) => ({ slug: a.slug.split("/") }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug.join("/")
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.title} — Support`,
    description: article.description,
    robots: { index: true, follow: true },
  }
}

export default async function SupportArticlePage({ params }: Props) {
  const slug = params.slug.join("/")
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/support" className="hover:text-foreground">&larr; Support Center</Link>
          <span>/</span>
          <span>{article.categoryLabel}</span>
        </div>

        <article>
          <h1 className="text-3xl font-heading font-bold mb-2">{article.title}</h1>
          <p className="text-muted-foreground mb-8">{article.description}</p>

          {/* Local developer-controlled markdown — processed via remark, not user input */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>
    </div>
  )
}
