"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * Admin layout — guards all /admin/* routes
 *
 * Security flow:
 * 1. Clerk middleware ensures user is logged in
 * 2. This layout checks isAdmin flag in Convex
 * 3. Non-admins are redirected to /admin/setup (if no admin exists) or /dashboard
 * 4. Convex queries double-check isAdmin server-side (defense in depth)
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isAdmin = useQuery(api.admin.isAdmin)
  const hasAdmin = useQuery(api.admin.hasAdmin)

  useEffect(() => {
    // Still loading
    if (isAdmin === undefined || hasAdmin === undefined) return

    // Allow setup page through regardless
    if (pathname === "/admin/setup") return

    // No admin exists yet — redirect to setup
    if (!hasAdmin) {
      router.replace("/admin/setup")
      return
    }

    // User is not admin — back to dashboard
    if (!isAdmin) {
      router.replace("/dashboard")
    }
  }, [isAdmin, hasAdmin, pathname, router])

  // Loading state
  if (isAdmin === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // Allow setup page for anyone logged in
  if (pathname === "/admin/setup") return <>{children}</>

  // Block non-admins (will redirect via useEffect)
  if (!isAdmin) return null

  return <>{children}</>
}
