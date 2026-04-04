import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Skeleton className="h-6 w-32" />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-16 mt-1" /></CardHeader>
              <CardContent><Skeleton className="h-3 w-24" /></CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
