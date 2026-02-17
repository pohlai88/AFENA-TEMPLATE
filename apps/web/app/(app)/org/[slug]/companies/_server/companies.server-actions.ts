'use server';

import {
  createCompany,
  deleteCompany,
  restoreCompany,
  updateCompany,
} from '@/app/actions/companies';
import { withActionAuthPassthrough } from '@/lib/actions/with-action-auth';

import {
  logActionError,
  logActionStart,
  logActionSuccess,
} from '../../_components/crud/server/action-logger_server';

import type { ActionEnvelope, ApiResponse, JsonValue } from 'afenda-canon';

/**
 * Enterprise company server actions — accept ActionEnvelope.
 * Uses withActionAuthPassthrough() for ALS, auth, envelope, and cache invalidation.
 */
export async function executeEntityAction(
  envelope: ActionEnvelope,
  extra: { expectedVersion?: number; input?: JsonValue; orgSlug?: string },
): Promise<ApiResponse> {
  return withActionAuthPassthrough(async (ctx) => {
    const start = Date.now();
    logActionStart(envelope, { userId: ctx.userId });

    try {
      let result: ApiResponse;
      switch (envelope.kind) {
        case 'create':
          result = await createCompany(extra.input ?? {});
          break;
        case 'update':
          if (!envelope.entityId || extra.expectedVersion === undefined) {
            return {
              result: { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Missing entityId or expectedVersion' }, meta: { requestId: ctx.requestId } },
            };
          }
          result = await updateCompany(envelope.entityId, extra.expectedVersion, extra.input ?? {});
          break;
        case 'delete':
          if (!envelope.entityId || extra.expectedVersion === undefined) {
            return {
              result: { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Missing entityId or expectedVersion' }, meta: { requestId: ctx.requestId } },
            };
          }
          result = await deleteCompany(envelope.entityId, extra.expectedVersion);
          break;
        case 'restore':
          if (!envelope.entityId || extra.expectedVersion === undefined) {
            return {
              result: { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Missing entityId or expectedVersion' }, meta: { requestId: ctx.requestId } },
            };
          }
          result = await restoreCompany(envelope.entityId, extra.expectedVersion);
          break;
        default:
          throw new Error(`Unsupported action kind: ${envelope.kind}`);
      }

      const durationMs = Date.now() - start;
      if (result.ok) {
        logActionSuccess(envelope, { userId: ctx.userId, durationMs });
      } else {
        logActionError(envelope, result.error, { userId: ctx.userId, durationMs });
      }

      return {
        result,
        ...(result.ok ? { invalidate: { entityType: 'companies' as const, ...(envelope.entityId ? { entityId: envelope.entityId } : {}) } } : {}),
      };
    } catch (error) {
      const durationMs = Date.now() - start;
      logActionError(envelope, error, { userId: ctx.userId, durationMs });
      throw error;
    }
  });
}
