'use server';

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
import { withActionAuthPassthrough } from '@/lib/actions/with-action-auth';

import {
  logActionError,
  logActionStart,
  logActionSuccess,
} from '../../_components/crud/server/action-logger_server';

import type { ActionEnvelope, ApiResponse } from 'afenda-canon';

/**
 * Enterprise contact server actions — accept ActionEnvelope.
 * Uses withActionAuth() for ALS, auth, envelope, and cache invalidation.
 */
export async function executeContactAction(
  envelope: ActionEnvelope,
  extra: { expectedVersion?: number; input?: Record<string, unknown>; orgSlug?: string },
): Promise<ApiResponse> {
  return withActionAuthPassthrough(async (ctx) => {
    const start = Date.now();
    logActionStart(envelope, { userId: ctx.userId });

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
            return {
              result: { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Missing entityId or expectedVersion' }, meta: { requestId: ctx.requestId } },
            };
          }
          result = await updateContact(
            envelope.entityId,
            extra.expectedVersion,
            extra.input as Record<string, unknown>,
          );
          break;

        case 'delete':
          if (!envelope.entityId || extra.expectedVersion === undefined) {
            return {
              result: { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Missing entityId or expectedVersion' }, meta: { requestId: ctx.requestId } },
            };
          }
          result = await deleteContact(envelope.entityId, extra.expectedVersion);
          break;

        case 'restore':
          if (!envelope.entityId || extra.expectedVersion === undefined) {
            return {
              result: { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Missing entityId or expectedVersion' }, meta: { requestId: ctx.requestId } },
            };
          }
          result = await restoreContact(envelope.entityId, extra.expectedVersion);
          break;

        case 'submit':
          if (!envelope.entityId || extra.expectedVersion === undefined) {
            return {
              result: { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Missing entityId or expectedVersion' }, meta: { requestId: ctx.requestId } },
            };
          }
          result = await submitContact(envelope.entityId, extra.expectedVersion);
          break;

        case 'cancel':
          if (!envelope.entityId || extra.expectedVersion === undefined) {
            return {
              result: { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Missing entityId or expectedVersion' }, meta: { requestId: ctx.requestId } },
            };
          }
          result = await cancelContact(envelope.entityId, extra.expectedVersion);
          break;

        case 'approve':
          if (!envelope.entityId || extra.expectedVersion === undefined) {
            return {
              result: { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Missing entityId or expectedVersion' }, meta: { requestId: ctx.requestId } },
            };
          }
          result = await approveContact(envelope.entityId, extra.expectedVersion);
          break;

        case 'reject':
          if (!envelope.entityId || extra.expectedVersion === undefined) {
            return {
              result: { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Missing entityId or expectedVersion' }, meta: { requestId: ctx.requestId } },
            };
          }
          result = await rejectContact(envelope.entityId, extra.expectedVersion);
          break;

        default:
          throw new Error(`Unsupported action kind: ${String(envelope.kind)}`);
      }

      const durationMs = Date.now() - start;

      if (result.ok) {
        logActionSuccess(envelope, { userId: ctx.userId, durationMs });
      } else {
        logActionError(envelope, result.error, { userId: ctx.userId, durationMs });
      }

      // Return the kernel result directly — withActionAuthPassthrough passes it through unchanged.
      return {
        result,
        ...(result.ok ? { invalidate: { entityType: 'contacts' as const, ...(envelope.entityId ? { entityId: envelope.entityId } : {}) } } : {}),
      };
    } catch (error) {
      const durationMs = Date.now() - start;
      logActionError(envelope, error, { userId: ctx.userId, durationMs });
      throw error;
    }
  });
}
