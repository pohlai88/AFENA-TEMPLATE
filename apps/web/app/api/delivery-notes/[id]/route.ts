import { NextRequest } from 'next/server';

import { readDeliveryNoteWithLines } from 'afena-crud';
import { getRequestId } from 'afena-logger';

import { withAuthOrApiKey } from '@/lib/api/with-auth-or-api-key';

/**
 * GET /api/delivery-notes/:id — Read delivery note with lines (BFF, unversioned).
 * Pass orgId from session context.
 */
export const GET = withAuthOrApiKey(async (request: NextRequest, session) => {
  const id = request.nextUrl.pathname.split('/').pop();
  if (!id) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'Missing delivery note ID', status: 400 };
  }

  const requestId = getRequestId() ?? crypto.randomUUID();
  const result = await readDeliveryNoteWithLines(id, session.orgId, requestId);

  if (!result.ok) {
    return {
      ok: false as const,
      code: result.error!.code,
      message: result.error!.message,
      status: result.error!.code === 'NOT_FOUND' ? 404 : 400,
    };
  }

  return { ok: true as const, data: result.data };
});
