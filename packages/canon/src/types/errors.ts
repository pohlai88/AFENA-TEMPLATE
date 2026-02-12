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
  'CONFLICT_VERSION',
  'IDEMPOTENCY_REPLAY',
  'NOT_FOUND',
  'INTERNAL_ERROR',
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

/** Structured error object for ApiResponse. */
export interface KernelError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}
