import type { ApiResponse, ErrorCode, KernelError, Receipt } from 'afena-canon';

/** Build a success response. */
export function ok<T>(data: T, requestId: string, receipt?: Receipt): ApiResponse<T> {
  return {
    ok: true,
    data,
    meta: { requestId, receipt },
  };
}

/** Build an error response. */
export function err(
  code: ErrorCode,
  message: string,
  requestId: string,
  receipt?: Receipt,
  details?: Record<string, unknown>,
): ApiResponse<never> {
  const error: KernelError = { code, message };
  if (details) error.details = details;
  return {
    ok: false,
    error,
    meta: { requestId, receipt },
  };
}
