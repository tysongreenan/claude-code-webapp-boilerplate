import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-heading font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-heading font-semibold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/"><Button>Go Home</Button></Link>
          <Link href="/support"><Button variant="outline">Support</Button></Link>
        </div>
      </div>
    </div>
  )
}
