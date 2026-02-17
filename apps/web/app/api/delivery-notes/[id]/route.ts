import { NextRequest } from 'next/server';

import { readDeliveryNoteWithLines } from 'afenda-crud';
import { getRequestId } from 'afenda-logger';

import { withAuthOrApiKey } from '@/lib/api/with-auth-or-api-key';

/**
 * GET /api/delivery-notes/:id — Read delivery note with lines (BFF endpoint).
 * 
 * This is a Backend-for-Frontend (BFF) endpoint that returns denormalized data
 * (delivery note header + lines in one response). BFF endpoints are allowed to
 * import directly from afenda-crud per no-restricted-imports policy.
 * 
 * @see packages/crud/src/read-delivery-note.ts
 */
export const GET = withAuthOrApiKey(async (request: NextRequest, session) => {
  const id = request.nextUrl.pathname.split('/').pop();
  if (!id) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Missing delivery note ID', status: 400 };
  }

  const requestId = getRequestId() ?? crypto.randomUUID();
  const result = await readDeliveryNoteWithLines(id, session.orgId, requestId);

  if (!result.ok) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- error is guaranteed to exist when ok is false
    const error = result.error!;
    return {
      ok: false as const,
      code: error.code,
      message: error.message,
      status: error.code === 'NOT_FOUND' ? 404 : 400,
    };
  }

  return { ok: true as const, data: result.data };
});
