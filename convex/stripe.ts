import { action, internalMutation } from "./_generated/server"
import { v } from "convex/values"
import { internal } from "./_generated/api"
import Stripe from "stripe"

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

// Create a Stripe Checkout session
export const createCheckout = action({
  args: {
    priceId: v.string(),
    mode: v.union(v.literal("subscription"), v.literal("payment")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const stripe = getStripe()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: args.priceId, quantity: 1 }],
      mode: args.mode,
      success_url: `${baseUrl}/dashboard?upgraded=true`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        tokenIdentifier: identity.tokenIdentifier,
        billingCycle: args.mode === "subscription" ? "annual" : "lifetime",
      },
      ...(args.mode === "payment" ? { customer_creation: "always" } : {}),
    })

    return session.url
  },
})

// Create a Stripe Customer Portal session
export const createPortal = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    // Get user's Stripe customer ID
    const user = await ctx.runQuery(internal.users.getByToken, {
      tokenIdentifier: identity.tokenIdentifier,
    })
    if (!user?.stripeCustomerId) throw new Error("No billing account")

    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    })

    return session.url
  },
})

// Internal: upgrade user after payment
export const upgradeUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    planTier: v.string(),
    billingCycle: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique()

    if (!user) return

    await ctx.db.patch(user._id, {
      planTier: args.planTier,
      billingCycle: args.billingCycle,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
    })
  },
})

// Internal: downgrade user
export const downgradeUser = internalMutation({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_stripe_customer", (q) => q.eq("stripeCustomerId", args.stripeCustomerId))
      .unique()

    if (!user) return

    await ctx.db.patch(user._id, {
      planTier: "free",
      billingCycle: undefined,
      stripeSubscriptionId: undefined,
    })
  },
})
