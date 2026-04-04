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

/**
 * Get the current user and verify they are an admin.
 * Returns the user if admin, throws if not.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx)
  if (!user) throw new Error("Not authenticated")
  if (!user.isAdmin) throw new Error("Not authorized — admin access required")
  return user
}
