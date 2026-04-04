import { query, mutation, internalMutation } from "./_generated/server"
import { v } from "convex/values"

// Get the current authenticated user
export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique()
  },
})

// Create or update user from Clerk webhook
export const upsertFromClerk = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      })
      return existing._id
    }

    // Create user + personal workspace
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      planTier: "free",
    })

    const teamId = await ctx.db.insert("teams", {
      name: `${args.name.split(" ")[0]}'s Workspace`,
      ownerId: userId,
    })

    await ctx.db.insert("teamMembers", {
      teamId,
      userId,
      role: "owner",
    })

    return userId
  },
})

// Delete user (from Clerk webhook)
export const deleteFromClerk = internalMutation({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique()

    if (user) {
      await ctx.db.delete(user._id)
    }
  },
})
