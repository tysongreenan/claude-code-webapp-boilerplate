"use client"

import { ReactNode } from "react"
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ConvexReactClient } from "convex/react"
import { ThemeProvider } from "next-themes"
import { PostHogProvider, PostHogIdentify } from "./posthog"
import { I18nProvider } from "@/lib/i18n/provider"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <I18nProvider>
              <PostHogIdentify />
              {children}
            </I18nProvider>
          </ThemeProvider>
        </PostHogProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
