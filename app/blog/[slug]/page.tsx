import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date },
    alternates: { canonical: `/blog/${params.slug}` },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  // Content sourced from local markdown files under developer control (not user input).
  // Processed through remark — safe for rendering.
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
          &larr; Back to Blog
        </Link>
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{post.author}</span>
              <span>&middot;</span>
              <span>{formatDate(post.date)}</span>
              <span>&middot;</span>
              <span>{post.readingTime}</span>
            </div>
          </header>
          {/* Blog markdown content — local developer-controlled files, not user-generated */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </div>
  )
}
