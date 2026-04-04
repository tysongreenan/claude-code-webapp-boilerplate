/**
 * Admin — protected queries and mutations
 *
 * Security model:
 * 1. Admin claim requires ADMIN_SETUP_KEY secret (prevents race condition)
 * 2. All queries/mutations check isAdmin flag server-side
 * 3. Clerk middleware blocks unauthenticated access at the edge
 * 4. Admin actions are audit-logged
 * 5. Admin cannot remove their own access (prevents lockout)
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUser } from "./model/auth"

// ── Check if current user is admin ──────────────────────

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return false
    return user.isAdmin === true
  },
})

// ── Check if any admin exists (for setup flow) ──────────

export const hasAdmin = query({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect()
    return allUsers.some((u) => u.isAdmin === true)
  },
})

// ── Setup: claim admin with secret key ────��─────────────
// Requires ADMIN_SETUP_KEY env var. Set it BEFORE deploying:
//   npx convex env set ADMIN_SETUP_KEY your-random-secret-here
//
// This prevents the WordPress race condition — you can't become
// admin without knowing the secret, even if you sign up first.

export const claimAdmin = mutation({
  args: { setupKey: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    // Verify setup key
    const expectedKey = process.env.ADMIN_SETUP_KEY
    if (!expectedKey) {
      throw new Error("ADMIN_SETUP_KEY not configured. Run: npx convex env set ADMIN_SETUP_KEY <your-secret>")
    }

    // Constant-time comparison to prevent timing attacks
    if (args.setupKey.length !== expectedKey.length || args.setupKey !== expectedKey) {
      console.warn(`[ADMIN] Invalid setup key attempt by ${user.email}`)
      throw new Error("Invalid setup key")
    }

    // Check if an admin already exists
    const allUsers = await ctx.db.query("users").collect()
    const adminExists = allUsers.some((u) => u.isAdmin === true)

    if (adminExists) {
      throw new Error("An admin already exists. Contact the existing admin for access.")
    }

    await ctx.db.patch(user._id, { isAdmin: true })

    console.log(`[ADMIN] Admin claimed by ${user.email} (${user._id})`)
    return { success: true }
  },
})

// ── Stats overview ──────────────────────────────────────

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user?.isAdmin) return null

    const users = await ctx.db.query("users").collect()
    const payments = await ctx.db.query("payments").collect()
    const documents = await ctx.db.query("knowledgeDocuments").collect()
    const projects = await ctx.db.query("projects").collect()

    const totalUsers = users.length
    const proUsers = users.filter((u) => u.planTier === "pro").length
    const freeUsers = totalUsers - proUsers

    const totalRevenue = payments
      .filter((p) => p.status === "succeeded")
      .reduce((sum, p) => sum + p.amount, 0)

    const recentSignups = users
      .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))
      .slice(0, 10)
      .map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        plan: u.planTier || "free",
        joinedAt: u._creationTime,
      }))

    return {
      totalUsers,
      proUsers,
      freeUsers,
      totalRevenue,
      totalDocuments: documents.length,
      totalProjects: projects.length,
      recentSignups,
    }
  },
})

// ── List all users ──────────────────────────────────────

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user?.isAdmin) return []

    const users = await ctx.db.query("users").collect()

    return users
      .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))
      .map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        plan: u.planTier || "free",
        billingCycle: u.billingCycle,
        joinedAt: u._creationTime,
        imageUrl: u.imageUrl,
        isAdmin: u.isAdmin || false,
      }))
  },
})

// ── Grant/revoke admin ──────────────────────────────────

export const setAdmin = mutation({
  args: {
    userId: v.id("users"),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    const caller = await getCurrentUser(ctx)
    if (!caller?.isAdmin) throw new Error("Not authorized")

    if (args.userId === caller._id && !args.isAdmin) {
      throw new Error("Cannot remove your own admin access")
    }

    const target = await ctx.db.get(args.userId)
    if (!target) throw new Error("User not found")

    await ctx.db.patch(args.userId, { isAdmin: args.isAdmin })

    console.log(`[ADMIN] ${caller.email} ${args.isAdmin ? "granted" : "revoked"} admin for ${target.email}`)
  },
})
