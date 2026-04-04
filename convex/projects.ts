import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUser } from "./model/auth"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    teamId: v.optional(v.id("teams")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    return await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      userId: user._id,
      teamId: args.teamId,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    const project = await ctx.db.get(args.id)
    if (!project || project.userId !== user._id) {
      throw new Error("Not found")
    }

    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    const project = await ctx.db.get(args.id)
    if (!project || project.userId !== user._id) {
      throw new Error("Not found")
    }

    await ctx.db.delete(args.id)
  },
})
