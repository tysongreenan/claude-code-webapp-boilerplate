"use client"

import { useUser } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const { user: clerkUser } = useUser()
  const user = useQuery(api.users.current)
  const projects = useQuery(api.projects.list)
  const createProject = useMutation(api.projects.create)
  const [creating, setCreating] = useState(false)

  async function handleCreateProject() {
    setCreating(true)
    await createProject({ name: `Project ${(projects?.length || 0) + 1}` })
    setCreating(false)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{clerkUser?.primaryEmailAddress?.emailAddress}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>{user?.name || clerkUser?.fullName}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Plan: <span className="font-medium text-foreground capitalize">{user?.planTier || "free"}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                {projects?.length || 0} project{projects?.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects?.map((p) => (
                <div key={p._id} className="text-sm p-2 rounded bg-muted">
                  {p.name}
                </div>
              ))}
              <Button size="sm" onClick={handleCreateProject} disabled={creating}>
                {creating ? "Creating..." : "New Project"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-time</CardTitle>
              <CardDescription>Data updates automatically</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Open this page in two tabs. Create a project in one — it appears instantly in the other. No refresh needed.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
