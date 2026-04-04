"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

/**
 * Admin Setup — WordPress-style first-run admin claim
 *
 * The first authenticated user to visit this page becomes the site admin.
 * After that, this page shows "admin already exists" and redirects.
 */
export default function AdminSetupPage() {
  const router = useRouter()
  const hasAdmin = useQuery(api.admin.hasAdmin)
  const claimAdmin = useMutation(api.admin.claimAdmin)
  const [claiming, setClaiming] = useState(false)
  const [error, setError] = useState("")

  async function handleClaim() {
    setClaiming(true)
    setError("")
    try {
      await claimAdmin()
      router.push("/admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim admin")
      setClaiming(false)
    }
  }

  if (hasAdmin === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (hasAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Already Configured</CardTitle>
            <CardDescription>
              An admin account already exists. Contact the site admin if you need access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            No admin account exists yet. Click below to become the site administrator.
            This can only be done once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <Button onClick={handleClaim} disabled={claiming} className="w-full">
            {claiming ? "Setting up..." : "Claim Admin Access"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            You will be able to grant admin access to other users later.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
