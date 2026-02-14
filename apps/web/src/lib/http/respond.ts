import { NextResponse } from 'next/server';

import { mapErrorCode } from './envelope';

import type { ApiResponse } from 'afena-canon';

/**
 * Convert an ApiResponse envelope into a NextResponse with correct status + headers.
 * Server actions return plain ApiResponse objects; route handlers use this.
 *
 * Keeps transport concerns (NextResponse, headers) out of envelope.ts.
 */
export function toNextResponse<T>(
  result: ApiResponse<T>,
  headers?: Record<string, string>,
): NextResponse<ApiResponse<T>> {
  const status = result.ok
    ? 200
    : mapErrorCode(result.error?.code ?? 'INTERNAL_ERROR');

  const init: ResponseInit = { status };
  if (headers) {
    init.headers = headers;
  }

  return NextResponse.json(result, init);
}
