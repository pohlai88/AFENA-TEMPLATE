/**
 * writeAuditLog — Phase 6 (K-03)
 *
 * Writes the audit_logs row inside the commit transaction.
 * Records the full before/after snapshots, diff, actor info, and mutation
 * provenance for compliance, debug, and replayability.
 *
 * MUST be called inside the same Drizzle transaction as the entity write.

 * @see INTEGRATION_PLAN.md §6.2
 */

import { getActionFamily } from 'afenda-canon';
import { auditLogs } from 'afenda-database';

import type { MutationContext } from '../context';
import type { PreparedMutation } from '../plan/prepared-mutation';
import type { HandlerResultShape } from './write-version';

/**
 * Insert one row into audit_logs inside `tx`.
 *
 * @param tx            Drizzle transaction (from withMutationTransaction)
 * @param plan          PreparedMutation — carries mutationId, validSpec, authoritySnapshot
 * @param handlerResult Row snapshots from the entity write
 * @param diff          Normalized diff (from generateDiff)
 * @param ctx           Request context for actor info + channel
 * @returns             The inserted audit row (with its generated `id`), or undefined on failure
 */
export async function writeAuditLog(
  tx: any,
  plan: PreparedMutation,
  handlerResult: HandlerResultShape,
  diff: unknown,
  ctx: MutationContext,
): Promise<{ id: string } | undefined> {
  const { validSpec, mutationId, authoritySnapshot } = plan;

  const [auditRow] = await tx
    .insert(auditLogs)
    .values({
      orgId: ctx.actor.orgId,
      actorUserId: ctx.actor.userId,
      actorName: ctx.actor.name ?? null,
      ownerId:
        (handlerResult.before as Record<string, unknown> | null)?.createdBy ??
        (handlerResult.after as Record<string, unknown> | null)?.createdBy ??
        ctx.actor.userId ??
        null,
      geoCountry: null,
      actionType: validSpec.actionType,
      actionFamily: getActionFamily(validSpec.actionType),
      entityType: validSpec.entityRef.type,
      entityId: handlerResult.entityId,
      requestId: ctx.requestId,
      mutationId,
      batchId: validSpec.batchId ?? null,
      versionBefore: handlerResult.versionBefore,
      versionAfter: handlerResult.versionAfter,
      channel: ctx.channel ?? 'web_ui',
      ip: ctx.ip ?? null,
      userAgent: ctx.userAgent ?? null,
      reason: validSpec.reason ?? null,
      authoritySnapshot,
      idempotencyKey: validSpec.idempotencyKey ?? null,
      before: handlerResult.before,
      after: handlerResult.after,
      diff,
    })
    .returning();

  return auditRow as { id: string } | undefined;
}
