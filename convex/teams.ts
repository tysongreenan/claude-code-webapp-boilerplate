import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUser } from "./model/auth"

// List teams the current user belongs to
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []

    const memberships = await ctx.db
      .query("teamMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()

    const teams = await Promise.all(
      memberships.map(async (m) => {
        const team = await ctx.db.get(m.teamId)
        return team ? { ...team, role: m.role } : null
      })
    )

    return teams.filter(Boolean)
  },
})

// Create a new team
export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    const teamId = await ctx.db.insert("teams", {
      name: args.name,
      ownerId: user._id,
    })

    await ctx.db.insert("teamMembers", {
      teamId,
      userId: user._id,
      role: "owner",
    })

    return teamId
  },
})

// Invite someone to a team
export const invite = mutation({
  args: {
    teamId: v.id("teams"),
    email: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    // Verify caller is owner/admin
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_user", (q) =>
        q.eq("teamId", args.teamId).eq("userId", user._id)
      )
      .unique()

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      throw new Error("Not authorized")
    }

    return await ctx.db.insert("teamInvitations", {
      teamId: args.teamId,
      email: args.email,
      role: args.role,
      invitedBy: user._id,
      status: "pending",
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })
  },
})
