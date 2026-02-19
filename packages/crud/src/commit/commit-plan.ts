/**
 * commitPlan — Commit Phase of the Mutation Kernel (Phase 4)
 *
 * Executes ALL database writes for a mutation inside a single transaction:
 *   1. Governor SET LOCAL (INVARIANT-GOVERNORS-01)
 *   2. Handler dispatch → entity write (INSERT / UPDATE / soft-delete / restore)
 *   3. entity_versions snapshot (K-03)
 *   4. audit_logs row (K-03)
 *   5. Outbox intents (K-12 — atomic with entity write)
 *
 * Throws on any error — the caller (mutate.ts) owns the catch + error mapping.
 * MUST NOT perform external network IO or fire-and-forget side effects.
 *
 * @see INTEGRATION_PLAN.md §4.2
 */

import type { MutationContext } from '../context';
import type { EntityHandlerV10, EntityHandlerV11 } from '../handlers/types';
import { isV11Handler } from '../handlers/types';
import { buildStandardIntents, writeOutboxIntents } from '../outbox/write-outbox';
import { applyGovernor, buildGovernorConfig } from '../plan/enforce/governor';
import type { CommitResult, PreparedMutation } from '../plan/prepared-mutation';
import { applyEntity } from './apply-entity';
import { generateDiff } from './compute-diff';
import { withMutationTransaction } from './session';
import { writeAuditLog } from './write-audit';
import { writeVersionSnapshot } from './write-version';

import type { MutationReceiptOk } from 'afenda-canon';

// ─────────────────────────────────────────────────────────────────────────────
// Searchable entity types — determines whether a search_outbox intent is queued
// Phase 3: Move to Canon entity-contract registry (searchable flag).
// ─────────────────────────────────────────────────────────────────────────────
const SEARCHABLE_ENTITY_TYPES = new Set(['contacts', 'companies']);

// ─────────────────────────────────────────────────────────────────────────────
// Commit Phase Entry Point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run all atomic DB writes for the prepared mutation.
 *
 * @param plan  Output of buildMutationPlan()
 * @param ctx   Request context (actor, channel, IP, …)
 * @returns     CommitResult with handlerResult + auditRow + receipt
 * @throws      DB errors / handler errors — caller maps to ApiResponse
 */
export async function commitPlan(
  plan: PreparedMutation,
  ctx: MutationContext,
): Promise<CommitResult> {
  const { verb, validSpec, sanitizedInput, handler, entityId, expectedVer } = plan;

  const governorConfig = buildGovernorConfig(
    ctx.channel === 'background_job' ? 'background' : 'interactive',
    ctx.actor.orgId,
    ctx.channel,
  );

  const result = await withMutationTransaction(ctx, async (tx) => {
      // INVARIANT-GOVERNORS-01: SET LOCAL timeouts + application_name
      await applyGovernor(tx as any, governorConfig);

      let handlerResult;

      if (isV11Handler(handler)) {
        // Phase 5: v1.1 dispatch — kernel performs generic entity write,
        // then calls the optional commitAfterEntityWrite hook.
        const v11Handler = handler as EntityHandlerV11;
        handlerResult = await applyEntity(
          tx,
          validSpec.entityRef.type,
          verb,
          entityId,
          sanitizedInput as Record<string, unknown>,
          expectedVer,
          ctx,
        );
        await v11Handler.commitAfterEntityWrite?.(
          tx as any,
          {} as any, // MutationPlan — populated as needed in Phase 6
          handlerResult.after,
        );
      } else {
      // Phase 4 legacy: Dispatch via v1.0 verb methods.
      const v10Handler = handler as unknown as EntityHandlerV10;

      switch (verb) {
        case 'create':
          handlerResult = await v10Handler.create(
            tx as any,
            sanitizedInput as Record<string, unknown>,
            ctx,
          );
          break;
        case 'update':
          handlerResult = await v10Handler.update(
            tx as any,
            entityId as string,
            sanitizedInput as Record<string, unknown>,
            expectedVer as number,
            ctx,
          );
          break;
        case 'delete':
          handlerResult = await v10Handler.delete(
            tx as any,
            entityId as string,
            expectedVer as number,
            ctx,
          );
          break;
        case 'restore':
          handlerResult = await v10Handler.restore(
            tx as any,
            entityId as string,
            expectedVer as number,
            ctx,
          );
          break;
        case 'submit':
          if (!v10Handler.submit)
            throw new Error(`Entity type '${validSpec.entityRef.type}' does not support submit`);
          handlerResult = await v10Handler.submit(
            tx as any,
            entityId as string,
            expectedVer as number,
            ctx,
          );
          break;
        case 'cancel':
          if (!(v10Handler as any).cancel)
            throw new Error(`Entity type '${validSpec.entityRef.type}' does not support cancel`);
          handlerResult = await (v10Handler as any).cancel(
            tx as any,
            entityId as string,
            expectedVer as number,
            ctx,
          );
          break;
        case 'amend':
          if (!(v10Handler as any).amend)
            throw new Error(`Entity type '${validSpec.entityRef.type}' does not support amend`);
          handlerResult = await (v10Handler as any).amend(
            tx as any,
            entityId as string,
            expectedVer as number,
            ctx,
          );
          break;
        case 'approve':
          if (!v10Handler.approve)
            throw new Error(`Entity type '${validSpec.entityRef.type}' does not support approve`);
          handlerResult = await v10Handler.approve(
            tx as any,
            entityId as string,
            expectedVer as number,
            ctx,
          );
          break;
        case 'reject':
          if (!v10Handler.reject)
            throw new Error(`Entity type '${validSpec.entityRef.type}' does not support reject`);
          handlerResult = await v10Handler.reject(
            tx as any,
            entityId as string,
            expectedVer as number,
            ctx,
          );
          break;
        default:
          throw new Error(`Unsupported verb: ${verb}`);
      }
      } // end v1.0 legacy dispatch

      // Generate diff (K-13: normalized snapshots)
      const diff = generateDiff(handlerResult.before, handlerResult.after);

      // Insert entity_versions row (K-03)
      await writeVersionSnapshot(tx, plan, handlerResult, diff, ctx);

      // Insert audit_logs row (K-03)
      const auditRow = await writeAuditLog(tx, plan, handlerResult, diff, ctx);

      // K-12: Outbox writes are ATOMIC with the entity write.
      // NO try/catch — if these fail, the entire TX rolls back (correct behaviour).
      const outboxIntents = buildStandardIntents({
        entityType: validSpec.entityRef.type,
        entityId: handlerResult.entityId,
        verb,
        fromStatus:
          (handlerResult.before as Record<string, unknown> | null)?.docStatus as
            | string
            | undefined ?? null,
        toStatus:
          (handlerResult.after as Record<string, unknown> | null)?.docStatus as
            | string
            | undefined ?? null,
        searchable: SEARCHABLE_ENTITY_TYPES.has(validSpec.entityRef.type),
      });
      await writeOutboxIntents(
        tx as Parameters<typeof writeOutboxIntents>[0],
        outboxIntents,
        { orgId: ctx.actor.orgId, traceId: ctx.requestId },
      );

      return { handlerResult, auditRow };
  });

  // Build success receipt (MutationReceiptOk — narrows status to 'ok')
  const receipt: MutationReceiptOk = {
    status: 'ok',
    requestId: ctx.requestId,
    mutationId: plan.mutationId,
    batchId: validSpec.batchId,
    entityId: result.handlerResult.entityId,
    entityType: validSpec.entityRef.type,
    versionBefore: result.handlerResult.versionBefore,
    versionAfter: result.handlerResult.versionAfter,
    auditLogId: result.auditRow?.id ?? null,
  };

  return {
    handlerResult: result.handlerResult,
    auditRow: result.auditRow,
    receipt,
  };
}
