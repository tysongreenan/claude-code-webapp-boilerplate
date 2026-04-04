import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog'
import { getAuthor } from '@/lib/authors'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { AuthorCard } from '@/components/blog/author-card'
import { ReadMoreSection } from '@/components/blog/read-more-section'
import { HashScrollHandler } from '@/components/blog/hash-scroll-handler'
import { StructuredData } from '@/components/seo/structured-data'
import type { Metadata } from 'next'

// SSG — pre-render all blog posts at build time
export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

// SEO metadata with keywords, canonical, OG, Twitter
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Post Not Found' }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  return {
    title: post.title,
    description: post.description,
    ...(post.keywords && { keywords: post.keywords.join(', ') }),
    authors: [{ name: post.author }],
    alternates: {
      canonical: post.canonical || `/blog/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      authors: [post.author],
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post || !post.published) notFound()

  const author = getAuthor(post.author || 'team')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  return (
    <>
      {/* BlogPosting JSON-LD — structured data for Google */}
      <StructuredData
        type="article"
        data={{
          title: post.title,
          description: post.description,
          author: post.author,
          datePublished: post.date,
          dateModified: post.updatedDate || post.date,
          image: post.image,
        }}
      />

      {/* FAQ JSON-LD — if post has FAQ schema in frontmatter */}
      {post.schema && (
        <StructuredData type="faq" data={post.schema.mainEntity || []} />
      )}

      {/* Breadcrumb JSON-LD */}
      <StructuredData
        type="breadcrumb"
        data={[
          { name: 'Home', url: baseUrl },
          { name: 'Blog', url: `${baseUrl}/blog` },
          { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
        ]}
      />

      <div className="min-h-screen bg-background">
        <HashScrollHandler />

        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto flex items-center h-16 px-4">
            <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
          </div>
        </header>

        {/* Post header */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto flex flex-col gap-4 p-6">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Button variant="outline" size="sm" asChild>
                <Link href="/blog">&larr; Blog</Link>
              </Button>
              {post.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
              <time>{formatDate(post.date)}</time>
              <span>{post.readingTime}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">{post.title}</h1>
            {post.description && (
              <p className="text-muted-foreground max-w-4xl md:text-lg">{post.description}</p>
            )}
          </div>
        </div>

        {/* Content + sidebar */}
        <div className="flex max-w-7xl mx-auto">
          {/* Main content */}
          <main className="flex-1 min-w-0">
            {post.image && (
              <img src={post.image} alt={post.title} className="w-full h-[400px] object-cover" />
            )}
            <div className="p-6 lg:p-10">
              {/* Developer-controlled markdown content with heading IDs for TOC */}
              <div
                className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight prose-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
            <ReadMoreSection currentSlug={post.slug} currentTags={post.tags} />
          </main>

          {/* Sidebar — TOC + Author */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0 p-6 lg:p-10 border-l border-border bg-muted/30">
            <div className="sticky top-20 space-y-8">
              <AuthorCard author={author} />
              <div className="border border-border rounded-lg p-4 bg-card">
                <TableOfContents />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
