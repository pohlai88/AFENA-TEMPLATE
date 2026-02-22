/**
 * Rate limiter — simple token bucket for records/second throttling.
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly ratePerSecond: number,
    private readonly maxBurst: number
  ) {
    this.tokens = maxBurst;
    this.lastRefill = Date.now();
  }

  async acquire(count: number): Promise<void> {
    this.refill();

    while (this.tokens < count) {
      const waitMs = Math.ceil(((count - this.tokens) / this.ratePerSecond) * 1000);
      await sleep(Math.min(waitMs, 1000));
      this.refill();
    }

    this.tokens -= count;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxBurst, this.tokens + elapsed * this.ratePerSecond);
    this.lastRefill = now;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
