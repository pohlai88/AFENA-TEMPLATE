/**
 * Retry with exponential backoff for transient DB connection drops (Neon serverless).
 * Per architecture: "Implement exponential backoff for transient connection drops."
 *
 * Use in critical paths: mutate(), drainSearchOutbox().
 */

const RETRYABLE_PATTERNS = [
  /ECONNRESET/i,
  /ETIMEDOUT/i,
  /ECONNREFUSED/i,
  /connection.*closed/i,
  /connection.*reset/i,
  /timeout/i,
  /fetch failed/i,
  /network/i,
];

function isRetryable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message ?? '';
  return RETRYABLE_PATTERNS.some((p) => p.test(msg));
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export interface RetryOptions {
  maxRetries?: number;
  baseMs?: number;
}

/**
 * Execute fn with exponential backoff on retryable errors.
 * Retries: baseMs, baseMs*2, baseMs*4, ...
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 3;
  const baseMs = options?.baseMs ?? 200;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < maxRetries && isRetryable(err)) {
        const delayMs = baseMs * Math.pow(2, attempt);
        await sleep(delayMs);
      } else {
        throw err;
      }
    }
  }
  throw lastErr;
}
