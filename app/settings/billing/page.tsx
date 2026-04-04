"use client"

import { useQuery, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import toast from "react-hot-toast"

export default function BillingSettingsPage() {
  const user = useQuery(api.users.current)
  const createPortal = useAction(api.stripe.createPortal)
  const createCheckout = useAction(api.stripe.createCheckout)
  const [loading, setLoading] = useState<string | null>(null)

  async function handleManageBilling() {
    setLoading("portal")
    try {
      const url = await createPortal()
      window.location.href = url as string
    } catch {
      toast.error("Failed to open billing portal")
      setLoading(null)
    }
  }

  async function handleUpgrade(priceId: string, mode: "subscription" | "payment") {
    setLoading(priceId)
    try {
      const url = await createCheckout({ priceId, mode })
      window.location.href = url as string
    } catch {
      toast.error("Failed to start checkout")
      setLoading(null)
    }
  }

  const isPro = user?.planTier === "pro"

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold capitalize">{user?.planTier || "Free"}</p>
              <p className="text-sm text-muted-foreground">
                {user?.billingCycle
                  ? `${user.billingCycle} billing`
                  : "No active subscription"}
              </p>
              {user?.subscriptionEndsAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Renews {new Date(user.subscriptionEndsAt).toLocaleDateString()}
                </p>
              )}
            </div>
            {isPro && (
              <Button variant="outline" onClick={handleManageBilling} disabled={loading === "portal"}>
                {loading === "portal" ? "Opening..." : "Manage Billing"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade options (only show if free) */}
      {!isPro && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade to Pro</CardTitle>
            <CardDescription>Unlock all features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Monthly */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <div>
                  <p className="font-semibold">Monthly</p>
                  <p className="text-2xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Unlimited projects</li>
                  <li>Team workspaces</li>
                  <li>Priority support</li>
                  <li>Cancel anytime</li>
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleUpgrade(
                    process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || "",
                    "subscription"
                  )}
                  disabled={loading !== null}
                >
                  {loading === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ? "Loading..." : "Subscribe Monthly"}
                </Button>
              </div>

              {/* Annual */}
              <div className="border-2 border-primary rounded-lg p-4 space-y-3 relative">
                <span className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                  Save 20%
                </span>
                <div>
                  <p className="font-semibold">Annual</p>
                  <p className="text-2xl font-bold">$15<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <p className="text-xs text-muted-foreground">$180 billed annually</p>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Everything in Monthly</li>
                  <li>2 months free</li>
                  <li>Priority support</li>
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleUpgrade(
                    process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL || "",
                    "subscription"
                  )}
                  disabled={loading !== null}
                >
                  {loading === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL ? "Loading..." : "Subscribe Annually"}
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Prices are in USD. You can cancel or change your plan anytime.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment history would go here */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View and download invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {isPro ? (
            <Button variant="outline" size="sm" onClick={handleManageBilling} disabled={loading === "portal"}>
              View Invoices in Stripe
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">No payments yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
