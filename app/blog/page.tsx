import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest articles, guides, and updates.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  const posts = getAllPosts()

  // Collect all unique tags
  const allTags = ['All', ...Array.from(new Set(posts.flatMap((p) => p.tags || []))).sort()]

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl font-heading font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-12">Latest articles and updates.</p>

        {posts.length === 0 ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              No posts yet. Add markdown files to <code className="bg-muted px-1 rounded">content/blog/</code>.
            </p>
            <p className="text-sm text-muted-foreground">
              See <code className="bg-muted px-1 rounded">content/blog/BLOG_WRITING_GUIDE.md</code> and
              <code className="bg-muted px-1 rounded ml-1">blog-post-template.md</code> for the SEO-optimized format.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="group border-b border-border pb-8 last:border-0">
                <Link href={`/blog/${post.slug}`} className="block space-y-3">
                  {post.image && (
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  )}
                  <h2 className="text-xl font-heading font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground">{post.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>{formatDate(post.date)}</span>
                    <span>&middot;</span>
                    <span>{post.readingTime}</span>
                    {post.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
