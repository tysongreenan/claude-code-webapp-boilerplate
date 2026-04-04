import { type Author } from "@/lib/authors"
import { cn } from "@/lib/utils"

export function AuthorCard({ author, className }: { author: Author; className?: string }) {
  return (
    <div className={cn("flex items-start gap-2", className)}>
      <img src={author.avatar} alt={author.name} className="rounded-full w-8 h-8 border border-border object-cover" />
      <div>
        <h3 className="text-sm font-semibold">{author.name}</h3>
        <p className="text-xs text-muted-foreground">{author.position}</p>
      </div>
    </div>
  )
}
