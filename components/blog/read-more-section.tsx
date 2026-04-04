import Link from "next/link"
import { getRelatedPosts } from "@/lib/blog"
import { formatDate } from "@/lib/utils"

export function ReadMoreSection({ currentSlug, currentTags = [] }: { currentSlug: string; currentTags?: string[] }) {
  const related = getRelatedPosts(currentSlug, currentTags, 3)
  if (related.length === 0) return null

  return (
    <section className="border-t border-border">
      <div className="p-6 lg:p-10">
        <h2 className="text-2xl font-medium mb-8">Read more</h2>
        <div className="flex flex-col gap-8">
          {related.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group grid grid-cols-1 lg:grid-cols-12 items-center gap-4">
              {post.image && (
                <div className="col-span-1 lg:col-span-4">
                  <img src={post.image} alt={post.title} className="w-full aspect-video object-cover rounded-lg group-hover:opacity-80 transition-opacity" />
                </div>
              )}
              <div className={`space-y-2 ${post.image ? "col-span-1 lg:col-span-8" : "col-span-12"}`}>
                <h3 className="text-lg font-semibold group-hover:underline underline-offset-4">{post.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3">{post.description}</p>
                <time className="block text-xs font-medium text-muted-foreground">{formatDate(post.date)}</time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
