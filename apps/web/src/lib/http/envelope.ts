import type { ApiResponse, ErrorCode } from 'afena-canon';

/**
 * HTTP status mapping for canon error codes.
 * Used by both route handlers (via respond.ts) and server actions (for logging).
 */
const ERROR_STATUS_MAP: Record<string, number> = {
  MISSING_ORG_ID: 403,
  VALIDATION_FAILED: 400,
  POLICY_DENIED: 403,
  LIFECYCLE_DENIED: 422,
  RATE_LIMITED: 429,
  CONFLICT_VERSION: 409,
  IDEMPOTENCY_REPLAY: 200,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  // Extended codes for route-level errors (not in canon yet)
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Map a canon ErrorCode to an HTTP status code.
 * Falls back to 500 for unknown codes.
 */
export function mapErrorCode(code: string): number {
  return ERROR_STATUS_MAP[code] ?? 500;
}

/**
 * Build a success envelope. Pure data — no Next.js imports.
 */
export function okEnvelope<T>(data: T, requestId: string): ApiResponse<T> {
  return {
    ok: true,
    data,
    meta: { requestId },
  };
}

/**
 * Build an error envelope. Pure data — no Next.js imports.
 * `requestId` is always a parameter — never generated inside.
 */
export function errorEnvelope(
  code: ErrorCode,
  message: string,
  requestId: string,
  details?: Record<string, unknown>,
): ApiResponse {
  return {
    ok: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    meta: { requestId },
  };
}
