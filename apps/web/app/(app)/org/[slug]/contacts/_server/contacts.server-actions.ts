'use server';

import { randomUUID } from 'crypto';

import { revalidatePath } from 'next/cache';

import {
  approveContact,
  cancelContact,
  createContact,
  deleteContact,
  rejectContact,
  restoreContact,
  submitContact,
  updateContact,
} from '@/app/actions/contacts';
import { auth } from '@/lib/auth/server';

import {
  logActionError,
  logActionStart,
  logActionSuccess,
} from '../../_components/crud/server/action-logger_server';

import type { ActionEnvelope, ApiResponse, ErrorCode } from 'afena-canon';

/**
 * Enterprise contact server actions — accept ActionEnvelope.
 * Always: policy check → execute → revalidatePath → log (INV-1).
 */

function errorResponse(code: ErrorCode, message: string): ApiResponse {
  return {
    ok: false,
    error: { code, message },
    meta: { requestId: randomUUID() },
  };
}

export async function executeContactAction(
  envelope: ActionEnvelope,
  extra: { expectedVersion?: number; input?: Record<string, unknown>; orgSlug?: string },
): Promise<ApiResponse> {
  const start = Date.now();

  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? '';

  if (!userId) {
    return errorResponse('POLICY_DENIED', 'No active session');
  }

  logActionStart(envelope, { userId });

  try {
    let result: ApiResponse;

    switch (envelope.kind) {
      case 'create':
        result = await createContact(extra.input as {
          name: string;
          email?: string;
          phone?: string;
          company?: string;
          notes?: string;
        });
        break;

      case 'update':
        if (!envelope.entityId || extra.expectedVersion === undefined) {
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        }
        result = await updateContact(
          envelope.entityId,
          extra.expectedVersion,
          extra.input as Record<string, unknown>,
        );
        break;

      case 'delete':
        if (!envelope.entityId || extra.expectedVersion === undefined) {
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        }
        result = await deleteContact(envelope.entityId, extra.expectedVersion);
        break;

      case 'restore':
        if (!envelope.entityId || extra.expectedVersion === undefined) {
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        }
        result = await restoreContact(envelope.entityId, extra.expectedVersion);
        break;

      case 'submit':
        if (!envelope.entityId || extra.expectedVersion === undefined) {
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        }
        result = await submitContact(envelope.entityId, extra.expectedVersion);
        break;

      case 'cancel':
        if (!envelope.entityId || extra.expectedVersion === undefined) {
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        }
        result = await cancelContact(envelope.entityId, extra.expectedVersion);
        break;

      case 'approve':
        if (!envelope.entityId || extra.expectedVersion === undefined) {
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        }
        result = await approveContact(envelope.entityId, extra.expectedVersion);
        break;

      case 'reject':
        if (!envelope.entityId || extra.expectedVersion === undefined) {
          return errorResponse('VALIDATION_FAILED', 'Missing entityId or expectedVersion');
        }
        result = await rejectContact(envelope.entityId, extra.expectedVersion);
        break;

      default:
        return errorResponse('VALIDATION_FAILED', `Unsupported action kind: ${envelope.kind}`);
    }

    const durationMs = Date.now() - start;

    if (result.ok) {
      logActionSuccess(envelope, { userId, durationMs });

      // INV-1: revalidatePath targets are exact and minimal
      const slug = extra.orgSlug ?? envelope.orgId;
      revalidatePath(`/org/${slug}/contacts`);
      if (envelope.entityId) {
        revalidatePath(`/org/${slug}/contacts/${envelope.entityId}`);
      }
      revalidatePath(`/org/${slug}/contacts/trash`);
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
