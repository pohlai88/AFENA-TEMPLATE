import { describe, it, expect } from 'vitest';
import { RateLimiter } from '../../worker/rate-limiter.js';

describe('RateLimiter', () => {
  it('should allow immediate acquisition within burst', async () => {
    const limiter = new RateLimiter(100, 100);
    const start = Date.now();
    await limiter.acquire(50);
    const elapsed = Date.now() - start;

    // Should be near-instant (within burst capacity)
    expect(elapsed).toBeLessThan(50);
  });

  it('should throttle when burst is exhausted', async () => {
    const limiter = new RateLimiter(100, 10);

    // Exhaust burst
    await limiter.acquire(10);

    // Next acquire should wait
    const start = Date.now();
    await limiter.acquire(5);
    const elapsed = Date.now() - start;

    // Should have waited ~50ms for 5 tokens at 100/s
    expect(elapsed).toBeGreaterThanOrEqual(30);
  });

  it('should refill tokens over time', async () => {
    const limiter = new RateLimiter(1000, 10);

    // Exhaust burst
    await limiter.acquire(10);

    // Wait for refill
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Should have refilled ~50 tokens (1000/s * 0.05s)
    const start = Date.now();
    await limiter.acquire(10);
    const elapsed = Date.now() - start;

    // Should be near-instant since we waited for refill
    expect(elapsed).toBeLessThan(50);
  });

  it('should not exceed max burst', async () => {
    const limiter = new RateLimiter(10000, 5);

    // Wait for potential over-refill
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Should still only have maxBurst (5) tokens
    // Acquiring 6 should require waiting
    const start = Date.now();
    await limiter.acquire(5);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(50); // Within burst
  });
});
