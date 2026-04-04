"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import toast from "react-hot-toast"

export default function ProfileSettingsPage() {
  const { user: clerkUser, isLoaded } = useUser()
  const convexUser = useQuery(api.users.current)

  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)

  // Initialize name from Clerk when loaded
  if (isLoaded && clerkUser && !name && clerkUser.fullName) {
    setName(clerkUser.fullName)
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    if (!clerkUser || !name.trim()) return
    setSaving(true)
    try {
      await clerkUser.update({ firstName: name.split(" ")[0], lastName: name.split(" ").slice(1).join(" ") })
      toast.success("Name updated")
    } catch {
      toast.error("Failed to update name")
    }
    setSaving(false)
  }

  if (!isLoaded) return <p className="text-muted-foreground">Loading...</p>

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {clerkUser?.imageUrl && (
              <img
                src={clerkUser.imageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full border border-border"
              />
            )}
            <div>
              <p className="font-medium">{clerkUser?.fullName || "No name set"}</p>
              <p className="text-sm text-muted-foreground">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <form onSubmit={handleSaveName} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Display Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <Button type="submit" disabled={saving} size="sm">
              {saving ? "Saving..." : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Plan info */}
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>Your current subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize">{convexUser?.planTier || "Free"} Plan</p>
              <p className="text-sm text-muted-foreground">
                {convexUser?.billingCycle
                  ? `Billed ${convexUser.billingCycle}`
                  : "No active subscription"}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/settings/billing">Manage Billing</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{clerkUser?.primaryEmailAddress?.emailAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Auth provider</span>
            <span className="capitalize">{clerkUser?.externalAccounts?.[0]?.provider || "Email"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member since</span>
            <span>{clerkUser?.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : "—"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Password and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Clerk's UserProfile component handles password management
              // For a simpler approach, link to Clerk's hosted profile
              window.open(clerkUser?.profileImageUrl ? "/user-profile" : "#", "_blank")
            }}
          >
            Change Password
          </Button>
          <p className="text-xs text-muted-foreground">
            Password management is handled by Clerk. You can also enable two-factor authentication.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
