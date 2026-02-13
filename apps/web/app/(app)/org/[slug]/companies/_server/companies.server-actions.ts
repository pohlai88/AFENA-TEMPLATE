'use server';

import { randomUUID } from 'crypto';

import { revalidatePath } from 'next/cache';

import {
  createCompany,
  deleteCompany,
  restoreCompany,
  updateCompany,
} from '@/app/actions/companies';
import { auth } from '@/lib/auth/server';

import {
  logActionError,
  logActionStart,
  logActionSuccess,
} from '../../_components/crud/server/action-logger_server';

import type { ActionEnvelope, ApiResponse, ErrorCode, JsonValue } from 'afena-canon';

function errorResponse(code: ErrorCode, message: string): ApiResponse {
  return { ok: false, error: { code, message }, meta: { requestId: randomUUID() } };
}

export async function executeEntityAction(
  envelope: ActionEnvelope,
  extra: { expectedVersion?: number; input?: JsonValue; orgSlug?: string },
): Promise<ApiResponse> {
  const start = Date.now();
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? '';
  if (!userId) return errorResponse('POLICY_DENIED', 'No active session');

  logActionStart(envelope, { userId });

  try {
    let result: ApiResponse;
    switch (envelope.kind) {
      case 'create':
        result = await createCompany(extra.input ?? {});
        break;
      case 'update':
        if (!envelope.entityId || extra.expectedVersion === undefined)
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        result = await updateCompany(envelope.entityId, extra.expectedVersion, extra.input ?? {});
        break;
      case 'delete':
        if (!envelope.entityId || extra.expectedVersion === undefined)
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        result = await deleteCompany(envelope.entityId, extra.expectedVersion);
        break;
      case 'restore':
        if (!envelope.entityId || extra.expectedVersion === undefined)
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        result = await restoreCompany(envelope.entityId, extra.expectedVersion);
        break;
      default:
        return errorResponse('VALIDATION_FAILED', `Unsupported action kind: ${envelope.kind}`);
    }

    const durationMs = Date.now() - start;
    if (result.ok) {
      logActionSuccess(envelope, { userId, durationMs });
      const slug = extra.orgSlug ?? envelope.orgId;
      revalidatePath(`/org/${slug}/companies`);
      if (envelope.entityId) revalidatePath(`/org/${slug}/companies/${envelope.entityId}`);
      revalidatePath(`/org/${slug}/companies/trash`);
    } else {
      logActionError(envelope, result.error, { userId, durationMs });
    }
    return result;
  } catch (error) {
    const durationMs = Date.now() - start;
    logActionError(envelope, error, { userId, durationMs });
    return errorResponse('INTERNAL_ERROR', 'Unexpected error');
  }
}
