/**
 * deliverEffects — Deliver Phase of the Mutation Kernel (Phase 4)
 *
 * Runs all fire-and-forget side effects AFTER the commit transaction succeeds.
 * Errors from any effect are silently swallowed — they MUST NOT affect the
 * mutation response already returned to the caller.
 *
 * Effects:
 *   1. Invalidate list cache for the mutated entity type + org (K-cache)
 *   2. Evaluate after-rules (workflow engine, side-effect only — cannot block)
 *   3. Meter the successful API request (observability)
 *
 * @see INTEGRATION_PLAN.md §4.3
 */

import { evaluateRules } from 'afenda-workflow';

import type { MutationContext } from '../context';
import type { CommitResult, PreparedMutation } from '../plan/prepared-mutation';
import { meterApiRequest } from './best-effort-metering';
import { invalidateListCache } from './invalidate-cache';

import type { MutationSpec } from 'afenda-canon';

/**
 * Fire all post-commit side effects (non-blocking).
 *
 * Intentionally NOT async — callers should NOT await this function.
 * All inner promises have .catch(() => {}) guards.
 *
 * @param plan        Output of buildMutationPlan()
 * @param commitResult Output of commitPlan()
 * @param ctx         Request context
 */
export function deliverEffects(
  plan: PreparedMutation,
  commitResult: CommitResult,
  ctx: MutationContext,
): void {
  const { validSpec } = plan;
  const { handlerResult } = commitResult;

  // 1. Invalidate list cache (Phase 2C)
  invalidateListCache(validSpec.entityRef.type, ctx.actor.orgId).catch(() => {});

  // 2. Evaluate after-rules (side-effects only — cannot block mutation response)
  evaluateRules('after', validSpec as MutationSpec, handlerResult.after, {
    requestId: ctx.requestId,
    actor: ctx.actor,
    channel: ctx.channel,
  }).catch(() => {
    // After-rule errors are swallowed — they must not affect the mutation response
  });

  // 3. Meter successful mutation (observability / billing)
  meterApiRequest(ctx.actor.orgId);
}
