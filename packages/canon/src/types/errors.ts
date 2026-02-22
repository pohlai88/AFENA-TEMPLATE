/**
 * Deterministic error taxonomy for the AIK kernel.
 * Every error returned by mutate() uses one of these codes.
 * ApiResponse.error.code is always one of these values.
 */
export const ERROR_CODES = [
  'MISSING_ORG_ID',
  'VALIDATION_FAILED',
  'POLICY_DENIED',
  'LIFECYCLE_DENIED',
  'RATE_LIMITED',
  'CONFLICT_VERSION',
  'IDEMPOTENCY_REPLAY',
  'NOT_FOUND',
  'INTERNAL_ERROR',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

/**
 * Reason why a failed mutation is eligible for retry.
 *
 * Used in `MutationReceiptError.retryableReason` to communicate the cause of a
 * server-side failure so callers can apply appropriate back-off / retry strategies.
 *
 * - `rate_limited`    — throttled by the rate limiter; honour `retryAfterMs`
 * - `db_timeout`      — statement_timeout or idle_in_transaction timed out
 * - `transient_error` — other transient infrastructure failure (network, etc.)
 */
export type RetryableReason = 'rate_limited' | 'db_timeout' | 'transient_error';

/**
 * Internal error class for Canon validation errors
 * 
 * NOTE: This is for internal use only. Public APIs should return CanonResult instead.
 */
export class CanonValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly field?: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CanonValidationError';
  }

  /**
   * Convert to CanonIssue format
   */
  toIssue(): { code: string; message: string; path?: (string | number)[]; details?: Record<string, unknown> } {
    return {
      code: this.code,
      message: this.message,
      ...(this.field ? { path: [this.field] } : {}),
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

/**
 * Internal error class for Canon parsing errors
 * 
 * NOTE: This is for internal use only. Public APIs should return CanonResult instead.
 */
export class CanonParseError extends Error {
  constructor(
    message: string,
    public readonly input: unknown,
    public readonly expected: string
  ) {
    super(message);
    this.name = 'CanonParseError';
  }
}

/** Structured error object for ApiResponse. */
export interface KernelError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Typed rate limit error — thrown by enforceRateLimit() in the kernel.
 * Follows the same pattern as LifecycleError.
 */
export class RateLimitError extends Error {
  readonly code = 'RATE_LIMITED' as const;
  readonly remaining: number;
  readonly resetMs: number;
  constructor(remaining: number, resetMs: number) {
    super(`Rate limit exceeded (resets in ${resetMs}ms)`);
    this.name = 'RateLimitError';
    this.remaining = remaining;
    this.resetMs = resetMs;
  }
}
