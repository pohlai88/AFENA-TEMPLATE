/**
 * Database Retry Utilities
 *
 * Neon serverless Postgres can return transient errors (connection pool
 * exhaustion, statement timeout) that are safe to retry. This module
 * provides a typed interface for detecting and retrying these cases.
 *
 * K-12 compatibility: retries happen at the TOP-LEVEL caller, never
 * inside a transaction. Callers must pass a function that opens a fresh
 * transaction on each attempt.
 */

/**
 * Neon-specific PostgreSQL error codes that are safe to retry.
 * Source: PostgreSQL SQLSTATE codes + Neon HTTP driver error conventions.
 */
const RETRYABLE_PG_CODES = new Set<string>([
  '40001', // serialization_failure (optimistic locking conflicts)
  '40P01', // deadlock_detected
  '08000', // connection_exception (generic)
  '08003', // connection_does_not_exist
  '08006', // connection_failure
  '57014', // query_canceled (statement timeout on Neon)
  '53300', // too_many_connections
  '08P01', // protocol_violation (transient Neon HTTP)
]);

const RETRYABLE_MESSAGE_PATTERNS = [
  /connection pool timeout/i,
  /neon: error/i,
  /endpoint is disabled/i,
  /transaction is aborted/i,
];

/**
 * Extract the SQLSTATE code from a DB error (if present).
 */
export function getDbTimeoutCode(err: unknown): string | undefined {
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>;
    // Drizzle / pg-core puts code at err.code (NeonDbError) or err.cause?.code
    if (typeof e['code'] === 'string') return e['code'];
    if (e['cause'] && typeof e['cause'] === 'object') {
      const cause = e['cause'] as Record<string, unknown>;
      if (typeof cause['code'] === 'string') return cause['code'];
    }
  }
  return undefined;
}

/**
 * Returns true when the error is a transient DB failure that is safe to retry.
 */
export function isDbTimeoutError(err: unknown): boolean {
  const code = getDbTimeoutCode(err);
  if (code && RETRYABLE_PG_CODES.has(code)) return true;

  if (err && typeof err === 'object') {
    const msg = String((err as Record<string, unknown>)['message'] ?? '');
    return RETRYABLE_MESSAGE_PATTERNS.some((re) => re.test(msg));
  }

  return false;
}

/**
 * Retry a DB operation on transient failures.
 *
 * K-12 IMPORTANT: The `operation` must be a factory function that opens a
 * FRESH transaction on each attempt. Never call this inside an existing
 * transaction — retrying a mid-transaction operation causes undefined state.
 *
 * @param operation - Async factory; called again on each retry attempt.
 * @param opts.maxAttempts - Maximum total attempts (default 3).
 * @param opts.baseDelayMs - Starting delay in ms, doubled each retry (default 100).
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  opts: { maxAttempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  const maxAttempts = opts.maxAttempts ?? 3;
  const baseDelayMs = opts.baseDelayMs ?? 100;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;

      if (!isDbTimeoutError(err) || attempt === maxAttempts) {
        throw err;
      }

      const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // Unreachable but satisfies TS
  throw lastError;
}
