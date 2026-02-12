/**
 * Rate Limiter Tests — Sprint 2 Governor
 *
 * Verifies sliding-window rate limiting keyed by org_id + route_group.
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { checkRateLimit, _resetRateLimitStore } from '../rate-limiter';

beforeEach(() => {
  _resetRateLimitStore();
});

describe('checkRateLimit', () => {
  it('allows requests under the limit', () => {
    const result = checkRateLimit('org_1', 'mutation');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it('returns correct remaining count', () => {
    const r1 = checkRateLimit('org_1', 'api', { maxRequests: 5, windowMs: 60_000 });
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(4);

    const r2 = checkRateLimit('org_1', 'api', { maxRequests: 5, windowMs: 60_000 });
    expect(r2.remaining).toBe(3);
  });

  it('denies when limit is reached', () => {
    const config = { maxRequests: 3, windowMs: 60_000 };
    checkRateLimit('org_1', 'test', config);
    checkRateLimit('org_1', 'test', config);
    checkRateLimit('org_1', 'test', config);

    const result = checkRateLimit('org_1', 'test', config);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.resetMs).toBeGreaterThan(0);
  });

  it('isolates rate limits by org', () => {
    const config = { maxRequests: 2, windowMs: 60_000 };
    checkRateLimit('org_1', 'test', config);
    checkRateLimit('org_1', 'test', config);

    // org_1 is exhausted
    expect(checkRateLimit('org_1', 'test', config).allowed).toBe(false);

    // org_2 is independent
    expect(checkRateLimit('org_2', 'test', config).allowed).toBe(true);
  });

  it('isolates rate limits by route group', () => {
    const config = { maxRequests: 2, windowMs: 60_000 };
    checkRateLimit('org_1', 'mutation', config);
    checkRateLimit('org_1', 'mutation', config);

    // mutation is exhausted
    expect(checkRateLimit('org_1', 'mutation', config).allowed).toBe(false);

    // query is independent
    expect(checkRateLimit('org_1', 'query', config).allowed).toBe(true);
  });

  it('returns limit metadata', () => {
    const config = { maxRequests: 10, windowMs: 60_000 };
    const result = checkRateLimit('org_1', 'api', config);
    expect(result.limit).toBe(10);
    expect(result.resetMs).toBe(60_000);
  });

  it('uses default config when no override provided', () => {
    const result = checkRateLimit('org_1', 'mutation');
    expect(result.limit).toBe(60); // mutation default
  });

  it('uses fallback config for unknown route groups', () => {
    const result = checkRateLimit('org_1', 'unknown_group');
    expect(result.limit).toBe(100); // DEFAULT_CONFIG
  });
});
