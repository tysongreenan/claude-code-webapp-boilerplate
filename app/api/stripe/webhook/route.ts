import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 })

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.payment_status !== "paid") break

      const tokenIdentifier = session.metadata?.tokenIdentifier
      if (!tokenIdentifier) break

      await convex.mutation(api.stripe.upgradeUser, {
        tokenIdentifier,
        planTier: "pro",
        billingCycle: session.metadata?.billingCycle || "lifetime",
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: (session.subscription as string) || undefined,
      })
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      await convex.mutation(api.stripe.downgradeUser, {
        stripeCustomerId: sub.customer as string,
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
