/**
 * Admin queries — real-time stats for the admin dashboard
 * All queries auto-update when data changes (Convex real-time)
 */

import { query } from "./_generated/server"
import { getCurrentUser } from "./model/auth"

// Stats overview — user count, subscribers, revenue, documents
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return null

    // TODO: Add admin role check here
    // if (user.role !== "admin") return null

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

// List all users with their plan info
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []

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
      }))
  },
})
