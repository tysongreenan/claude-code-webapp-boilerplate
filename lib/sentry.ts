// Sentry is configured via sentry.client.config.ts and sentry.server.config.ts
// This file provides helpers for manual error capture

export function captureError(error: unknown, context?: Record<string, any>) {
  if (typeof window !== "undefined") {
    import("@sentry/nextjs").then((Sentry) => {
      Sentry.captureException(error, { extra: context })
    })
  } else {
    import("@sentry/nextjs").then((Sentry) => {
      Sentry.captureException(error, { extra: context })
    })
  }
}
