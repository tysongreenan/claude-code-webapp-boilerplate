/**
 * Upstash Redis — serverless Redis for rate limiting, caching, and queues
 *
 * Used in API routes and Convex actions for:
 * - Rate limiting (per-user, per-IP)
 * - Short-lived caching
 * - Feature flags backup
 */

import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

let redis: Redis | null = null

export function getRedis(): Redis {
  if (!redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error("Upstash Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.")
    }
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redis
}

// Rate limiter: 10 requests per 10 seconds per identifier
export function createRateLimiter(maxRequests = 10, windowSeconds = 10) {
  return new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
    analytics: true,
  })
}

// Cache helpers
export async function cacheGet<T>(key: string): Promise<T | null> {
  const data = await getRedis().get<T>(key)
  return data
}

export async function cacheSet(key: string, value: any, ttlSeconds = 300) {
  await getRedis().set(key, value, { ex: ttlSeconds })
}

export async function cacheDel(key: string) {
  await getRedis().del(key)
}
