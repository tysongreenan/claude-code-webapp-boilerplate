import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // ── Users ─────────────────────────────────────────────
  // Synced from Clerk via webhook. tokenIdentifier links to Clerk identity.
  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    tokenIdentifier: v.string(),
    planTier: v.optional(v.string()), // 'free', 'pro', 'enterprise'
    billingCycle: v.optional(v.string()), // 'monthly', 'annual', 'lifetime'
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionEndsAt: v.optional(v.number()), // timestamp
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  // ── Teams / Workspaces ────────────────────────────────
  teams: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
  }),

  teamMembers: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
    role: v.string(), // 'owner', 'admin', 'editor', 'viewer'
  })
    .index("by_team", ["teamId"])
    .index("by_user", ["userId"])
    .index("by_team_user", ["teamId", "userId"]),

  teamInvitations: defineTable({
    teamId: v.id("teams"),
    email: v.string(),
    role: v.string(),
    invitedBy: v.id("users"),
    status: v.string(), // 'pending', 'accepted', 'expired'
    expiresAt: v.number(),
  })
    .index("by_team", ["teamId"])
    .index("by_email", ["email"]),

  // ── Projects ──────────────────────────────────────────
  // Generic — customize for your app's main entity
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
    teamId: v.optional(v.id("teams")),
  })
    .index("by_user", ["userId"])
    .index("by_team", ["teamId"]),

  // ── Payments ──────────────────────────────────────────
  payments: defineTable({
    userId: v.id("users"),
    amount: v.number(), // cents
    currency: v.string(),
    status: v.string(), // 'succeeded', 'failed', 'refunded'
    planTier: v.string(),
    paymentType: v.string(), // 'one_time', 'subscription'
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_session", ["stripeSessionId"]),
})
