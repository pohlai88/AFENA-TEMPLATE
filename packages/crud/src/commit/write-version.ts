/**
 * writeVersionSnapshot — Phase 6 (K-03)
 *
 * Writes the entity_versions row inside the commit transaction.
 * Captures a full JSON snapshot + normalized diff of the entity after each
 * mutation for history, audit, and conflict-detection purposes.
 *
 * MUST be called inside the same Drizzle transaction as the entity write.
 *
 * @see INTEGRATION_PLAN.md §6.2
 */

import { entityVersions } from 'afenda-database';

import type { MutationContext } from '../context';
import type { PreparedMutation } from '../plan/prepared-mutation';

/**
 * Minimal handler result shape required by commit-phase write helpers.
 * Mirrors the inner result from applyEntity() / v1.0 handlers.
 */
export interface HandlerResultShape {
  entityId: string;
  versionBefore: number | null;
  versionAfter: number;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
}

/**
 * Insert one row into entity_versions inside `tx`.
 *
 * @param tx            Drizzle transaction (from withMutationTransaction)
 * @param plan          PreparedMutation for entity type + actor info
 * @param handlerResult Row snapshots from the entity write
 * @param diff          Normalized diff (from generateDiff)
 * @param ctx           Request context for orgId / userId
 */
export async function writeVersionSnapshot(
  tx: any,
  plan: PreparedMutation,
  handlerResult: HandlerResultShape,
  diff: unknown,
  ctx: MutationContext,
): Promise<void> {
  await tx.insert(entityVersions).values({
    orgId: ctx.actor.orgId,
    entityType: plan.validSpec.entityRef.type,
    entityId: handlerResult.entityId,
    version: handlerResult.versionAfter,
    parentVersion: handlerResult.versionBefore,
    snapshot: handlerResult.after,
    diff,
    createdBy: ctx.actor.userId,
  });
}
