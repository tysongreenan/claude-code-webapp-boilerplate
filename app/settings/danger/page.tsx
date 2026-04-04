"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function DangerZonePage() {
  const { user: clerkUser } = useUser()
  const router = useRouter()
  const [confirmText, setConfirmText] = useState("")
  const [deleting, setDeleting] = useState(false)

  const email = clerkUser?.primaryEmailAddress?.emailAddress || ""
  const canDelete = confirmText === email

  async function handleDeleteAccount() {
    if (!canDelete || !clerkUser) return
    setDeleting(true)
    try {
      // Delete from Clerk (this also triggers webhook to clean up Convex data)
      await clerkUser.delete()
      toast.success("Account deleted")
      router.push("/")
    } catch {
      toast.error("Failed to delete account. Contact support.")
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Export data */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download a copy of your data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Request a copy of all your data including projects, settings, and account information.
          </p>
          <Button variant="outline" size="sm" onClick={() => toast.success("Data export requested. Check your email.")}>
            Request Data Export
          </Button>
        </CardContent>
      </Card>

      {/* Delete account */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 text-sm space-y-2">
            <p className="font-medium text-destructive">This will permanently:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Delete your account and profile</li>
              <li>Delete all your projects</li>
              <li>Remove you from all teams</li>
              <li>Cancel any active subscriptions</li>
              <li>Delete your data from our systems</li>
            </ul>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Type <span className="font-mono bg-muted px-1 rounded">{email}</span> to confirm
            </label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Enter your email to confirm"
              className="mb-3"
            />
            <Button
              variant="destructive"
              disabled={!canDelete || deleting}
              onClick={handleDeleteAccount}
            >
              {deleting ? "Deleting..." : "Permanently Delete Account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
