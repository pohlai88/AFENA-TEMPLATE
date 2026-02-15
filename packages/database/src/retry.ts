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
  /connection pool timeout/i,
  /query_wait_timeout/i,
  /timeout/i,
  /fetch failed/i,
  /network/i,
];

function isRetryable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message ?? '';
  return RETRYABLE_PATTERNS.some((p) => p.test(msg));
}

/** Structured codes for Neon/PgBouncer timeout errors (alerting, metering). */
export type DbTimeoutCode =
  | 'NEON_POOL_TIMEOUT'
  | 'PG_QUERY_WAIT_TIMEOUT'
  | 'PG_STATEMENT_TIMEOUT'
  | 'PG_IDLE_IN_TX_TIMEOUT';

/**
 * Classify DB error as a timeout that should be metered.
 * Returns structured code for alerting; null if not a timeout.
 */
export function getDbTimeoutCode(err: unknown): DbTimeoutCode | null {
  if (!(err instanceof Error)) return null;
  const msg = err.message ?? '';
  if (/connection pool timeout/i.test(msg)) return 'NEON_POOL_TIMEOUT';
  if (/query_wait_timeout/i.test(msg)) return 'PG_QUERY_WAIT_TIMEOUT';
  if (/statement timeout/i.test(msg)) return 'PG_STATEMENT_TIMEOUT';
  if (/idle-in-transaction timeout/i.test(msg)) return 'PG_IDLE_IN_TX_TIMEOUT';
  return null;
}

/** True if error is a DB timeout (statement, idle-in-tx, pool, query_wait). */
export function isDbTimeoutError(err: unknown): boolean {
  return getDbTimeoutCode(err) !== null;
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
