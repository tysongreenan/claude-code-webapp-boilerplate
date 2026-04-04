/**
 * Support content system — like the blog system but for help articles
 *
 * Articles live in content/support/{category}/*.md
 * Categories: getting-started, billing, features, troubleshooting
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

const supportDir = path.join(process.cwd(), "content/support")

export interface SupportArticle {
  slug: string
  title: string
  description: string
  category: string
  categoryLabel: string
  order: number
  content: string
}

const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  billing: "Billing",
  features: "Features",
  troubleshooting: "Troubleshooting",
}

function slugFromPath(category: string, filename: string): string {
  return `${category}/${filename.replace(/\.md$/, "")}`
}

export function getAllArticles(): Omit<SupportArticle, "content">[] {
  if (!fs.existsSync(supportDir)) return []

  const articles: Omit<SupportArticle, "content">[] = []

  const categories = fs.readdirSync(supportDir).filter((f) =>
    fs.statSync(path.join(supportDir, f)).isDirectory()
  )

  for (const category of categories) {
    const categoryPath = path.join(supportDir, category)
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".md"))

    for (const file of files) {
      const fullPath = path.join(categoryPath, file)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data } = matter(fileContents)

      articles.push({
        slug: slugFromPath(category, file),
        title: data.title || file.replace(/\.md$/, ""),
        description: data.description || "",
        category,
        categoryLabel: CATEGORY_LABELS[category] || category,
        order: data.order || 99,
      })
    }
  }

  return articles.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category)
    return a.order - b.order
  })
}

export function getArticlesByCategory(): Record<string, Omit<SupportArticle, "content">[]> {
  const articles = getAllArticles()
  const grouped: Record<string, Omit<SupportArticle, "content">[]> = {}

  for (const article of articles) {
    if (!grouped[article.category]) grouped[article.category] = []
    grouped[article.category].push(article)
  }

  return grouped
}

export async function getArticleBySlug(slug: string): Promise<SupportArticle | null> {
  const fullPath = path.join(supportDir, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content: rawContent } = matter(fileContents)
  const processedContent = await remark().use(html).process(rawContent)

  const parts = slug.split("/")
  const category = parts[0]

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    category,
    categoryLabel: CATEGORY_LABELS[category] || category,
    order: data.order || 99,
    content: processedContent.toString(),
  }
}

// Get all articles as plain text (for RAG ingestion)
export function getAllArticlesForIngestion(): { title: string; content: string; category: string }[] {
  if (!fs.existsSync(supportDir)) return []

  const results: { title: string; content: string; category: string }[] = []

  const categories = fs.readdirSync(supportDir).filter((f) =>
    fs.statSync(path.join(supportDir, f)).isDirectory()
  )

  for (const category of categories) {
    const categoryPath = path.join(supportDir, category)
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".md"))

    for (const file of files) {
      const fullPath = path.join(categoryPath, file)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      results.push({
        title: data.title || file.replace(/\.md$/, ""),
        content: content.trim(),
        category,
      })
    }
  }

  return results
}
