import { QueryCtx, MutationCtx } from "../_generated/server"

/**
 * Get the current authenticated user from Convex DB.
 * Use this in queries and mutations to get the caller's user record.
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null

  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique()
}
