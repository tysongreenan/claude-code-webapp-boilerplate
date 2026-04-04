/**
 * Blog system — Markdown with full SEO/AEO support
 *
 * Features:
 * - remarkHeadingIds for auto-generated anchor links
 * - published/draft system
 * - keywords, canonical, updatedDate, schema frontmatter
 * - Reading time calculation
 * - Related posts by tag overlap
 * - FAQ structured data extraction
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import readingTime from 'reading-time'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Custom remark plugin to add IDs to headings (enables TOC + anchor links)
function remarkHeadingIds() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === 'heading') {
        const text = node.children
          .filter((child: any) => child.type === 'text')
          .map((child: any) => child.value)
          .join('')

        if (text) {
          node.data = node.data || {}
          node.data.hProperties = node.data.hProperties || {}
          node.data.hProperties.id = slugify(text)
        }
      }

      if (node.children) {
        node.children.forEach(visit)
      }
    }

    visit(tree)
  }
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  updatedDate?: string
  author: string
  image?: string
  tags: string[]
  keywords?: string[]
  content: string
  readingTime: string
  published: boolean
  canonical?: string
  schema?: any
}

export interface BlogPostMetadata {
  slug: string
  title: string
  description: string
  date: string
  updatedDate?: string
  author: string
  image?: string
  tags: string[]
  readingTime: string
  published: boolean
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  return fs.readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md') && f !== 'BLOG_WRITING_GUIDE.md' && f !== 'blog-post-template.md')
    .map((f) => f.replace(/\.md$/, ''))
}

export function getAllPosts(): BlogPostMetadata[] {
  const slugs = getAllPostSlugs()
  return slugs
    .map((slug) => {
      const fullPath = path.join(postsDirectory, `${slug}.md`)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = readingTime(content)

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        updatedDate: data.updatedDate || undefined,
        author: data.author || 'Team',
        image: data.image || '',
        tags: data.tags || [],
        readingTime: stats.text,
        published: data.published !== false,
      }
    })
    .filter((post) => post.published)
    .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const processedContent = await remark()
      .use(remarkHeadingIds)
      .use(html, { sanitize: false })
      .process(content)

    const stats = readingTime(content)

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      updatedDate: data.updatedDate || undefined,
      author: data.author || 'Team',
      image: data.image || '',
      tags: data.tags || [],
      content: processedContent.toString(),
      readingTime: stats.text,
      published: data.published !== false,
      keywords: data.keywords || undefined,
      canonical: data.canonical || undefined,
      schema: data.schema || null,
    }
  } catch {
    return null
  }
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit = 3): BlogPostMetadata[] {
  return getAllPosts()
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      ...post,
      relevance: tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => {
      if (a.relevance !== b.relevance) return b.relevance - a.relevance
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, limit)
}
