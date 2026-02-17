import type { ApiResponse, ErrorCode, KernelError, Receipt } from 'afenda-canon';

/** Optional meta fields to merge into the response envelope. */
export type ApiMetaExtras = { totalCount?: number; nextCursor?: string };

/** Build a success response. */
export function ok<T>(
  data: T,
  requestId: string,
  receipt?: Receipt,
  meta?: ApiMetaExtras,
): ApiResponse<T> {
  const base = { requestId, receipt };
  return {
    ok: true,
    data,
    meta: meta ? { ...base, ...meta } : base,
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
