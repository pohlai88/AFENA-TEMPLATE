/**
 * In-memory sliding-window rate limiter.
 * Key: org_id + route_group.
 *
 * MVP — no external deps (Redis). Sufficient for single-process deployments.
 * For multi-instance, swap the store for a shared backend (Redis/Neon).
 *
 * Spec §C2: Rate limit key = org_id + route_group.
 */

export interface RateLimitConfig {
  /** Max requests allowed in the window. */
  maxRequests: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

interface SlidingWindow {
  timestamps: number[];
}

/** Default presets per route group. */
const ROUTE_GROUP_DEFAULTS: Record<string, RateLimitConfig> = {
  mutation: { maxRequests: 60, windowMs: 60_000 },
  query: { maxRequests: 120, windowMs: 60_000 },
  search: { maxRequests: 60, windowMs: 60_000 },
  api: { maxRequests: 100, windowMs: 60_000 },
};

const DEFAULT_CONFIG: RateLimitConfig = { maxRequests: 100, windowMs: 60_000 };

/** In-memory store — keyed by "orgId:routeGroup". */
const store = new Map<string, SlidingWindow>();

/** Periodic cleanup interval (5 min). */
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, window] of store) {
      window.timestamps = window.timestamps.filter((t) => now - t < 120_000);
      if (window.timestamps.length === 0) store.delete(key);
    }
  }, 300_000);
  // Unref so it doesn't keep the process alive
  if (typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetMs: number;
}

/**
 * Check and consume a rate limit token.
 * Returns whether the request is allowed + metadata for headers.
 */
export function checkRateLimit(
  orgId: string,
  routeGroup: string,
  configOverride?: Partial<RateLimitConfig>,
): RateLimitResult {
  ensureCleanup();

  const config: RateLimitConfig = {
    ...(ROUTE_GROUP_DEFAULTS[routeGroup] ?? DEFAULT_CONFIG),
    ...configOverride,
  };

  const key = `${orgId}:${routeGroup}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let window = store.get(key);
  if (!window) {
    window = { timestamps: [] };
    store.set(key, window);
  }

  // Prune expired timestamps
  window.timestamps = window.timestamps.filter((t) => t > windowStart);

  const currentCount = window.timestamps.length;

  if (currentCount >= config.maxRequests) {
    // Find when the oldest timestamp in the window expires
    const oldestInWindow = window.timestamps[0] ?? now;
    const resetMs = oldestInWindow + config.windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      limit: config.maxRequests,
      resetMs: Math.max(resetMs, 0),
    };
  }

  // Consume a token
  window.timestamps.push(now);

  return {
    allowed: true,
    remaining: config.maxRequests - currentCount - 1,
    limit: config.maxRequests,
    resetMs: config.windowMs,
  };
}

/**
 * Get rate limit config for a route group (for header reporting).
 */
export function getRateLimitConfig(routeGroup: string): RateLimitConfig {
  return ROUTE_GROUP_DEFAULTS[routeGroup] ?? DEFAULT_CONFIG;
}

/**
 * Reset rate limit state (testing only).
 * Guarded: throws if called outside NODE_ENV=test.
 */
export function _resetRateLimitStore(): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('_resetRateLimitStore is test-only');
  }
  store.clear();
}
