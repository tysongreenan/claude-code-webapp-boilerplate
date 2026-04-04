/**
 * Admin — protected queries and mutations
 *
 * Security model (WordPress-style):
 * 1. First user to visit /admin/setup becomes the admin
 * 2. All admin queries/mutations check isAdmin flag
 * 3. Middleware blocks /admin routes for non-admins at the edge
 * 4. Convex functions double-check isAdmin as a second layer
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUser, requireAdmin } from "./model/auth"

// ── Check if current user is admin (used by middleware) ──

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
    const admins = await ctx.db.query("users").collect()
    return admins.some((u) => u.isAdmin === true)
  },
})

// ── Setup: make current user the admin (one-time) ───────
// Like WordPress install — first user to claim becomes admin.
// Only works if no admin exists yet.

export const claimAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    // Check if an admin already exists
    const allUsers = await ctx.db.query("users").collect()
    const adminExists = allUsers.some((u) => u.isAdmin === true)

    if (adminExists) {
      throw new Error("An admin already exists. Contact the existing admin for access.")
    }

    // Make this user the admin
    await ctx.db.patch(user._id, { isAdmin: true })
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
    // Only existing admins can grant/revoke
    const caller = await getCurrentUser(ctx)
    if (!caller?.isAdmin) throw new Error("Not authorized")

    // Prevent removing your own admin
    if (args.userId === caller._id && !args.isAdmin) {
      throw new Error("Cannot remove your own admin access")
    }

    await ctx.db.patch(args.userId, { isAdmin: args.isAdmin })
  },
})
