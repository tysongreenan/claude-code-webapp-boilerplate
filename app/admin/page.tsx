"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const stats = useQuery(api.admin.stats)

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/knowledge">
              <Button variant="outline" size="sm">Knowledge Base</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Back to App</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stats.proUsers} pro / {stats.freeUsers} free
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Revenue</CardDescription>
              <CardTitle className="text-3xl">${(stats.totalRevenue / 100).toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Lifetime total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Projects</CardDescription>
              <CardTitle className="text-3xl">{stats.totalProjects}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Across all users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Knowledge Docs</CardDescription>
              <CardTitle className="text-3xl">{stats.totalDocuments}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <Link href="/admin/knowledge" className="hover:underline">
                  Manage &rarr;
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent signups */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>Latest users (real-time — updates automatically)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentSignups.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      user.plan === "pro"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {user.plan}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recentSignups.length === 0 && (
                <p className="text-sm text-muted-foreground">No users yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
