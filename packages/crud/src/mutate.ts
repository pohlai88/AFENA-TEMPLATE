import { LifecycleError, RateLimitError } from 'afenda-canon';
import { getDbTimeoutCode, isDbTimeoutError } from 'afenda-database';
import { WorkflowEngineError } from 'afenda-workflow';

import { commitPlan } from './commit/commit-plan';
import { meterDbTimeout } from './deliver/best-effort-metering';
import { deliverEffects } from './deliver/deliver-effects';
import { getObservabilityHooks } from './observability-hooks';
import { buildMutationPlan } from './plan/build-plan';
import { err, ok } from './util/envelope';

import type { ApiResponse, ErrorCode, MutationReceipt, MutationSpec } from 'afenda-canon';
import type { MutationContext } from './context';
import type { PreparedMutation } from './plan/prepared-mutation';

/**
 * K-01: mutate() is the ONLY way to write domain data.
 * K-02: runs in a single DB transaction.
 * K-03: ALWAYS writes audit_logs + entity_versions.
 * K-05: one of only 3 public exports from packages/crud.
 *
 * Phase 4: Thin orchestrator � delegates to:
 *   buildMutationPlan() ? commitPlan() ? deliverEffects()
 */
export async function mutate(
  spec: MutationSpec,
  ctx: MutationContext,
): Promise<ApiResponse> {
  const t0 = Date.now();
  const hooks = getObservabilityHooks();
  hooks.onMutationStart(ctx, spec);

  const planResult = await buildMutationPlan(spec, ctx);

  if (!('mutationId' in planResult)) {
    const r = planResult as any;
    hooks.onMutationRejected(ctx, r.errorCode ?? 'PLAN_REJECTION', r.message ?? 'Plan rejected');
    return planResult as ApiResponse;
  }
  const plan = planResult as PreparedMutation;

  let commitResult;
  try {
    commitResult = await commitPlan(plan, ctx);
  } catch (error) {
    return mapCommitError(error, plan, ctx, t0);
  }

  deliverEffects(plan, commitResult, ctx);
  hooks.onMutationCommitted(ctx, commitResult.receipt, Date.now() - t0);
  return ok(commitResult.handlerResult.after, ctx.requestId, commitResult.receipt);
}

function mapCommitError(
  error: unknown,
  plan: PreparedMutation,
  ctx: MutationContext,
  t0: number,
): ApiResponse {
  const hooks = getObservabilityHooks();
  const durationMs = Date.now() - t0;
  const message = error instanceof Error ? error.message : 'Unknown error';

  let errorCode: ErrorCode = 'INTERNAL_ERROR';
  if ((error as any)?.code === 'POLICY_DENIED') errorCode = 'POLICY_DENIED';
  if (error instanceof LifecycleError) errorCode = 'LIFECYCLE_DENIED';
  if (error instanceof WorkflowEngineError) errorCode = 'LIFECYCLE_DENIED';
  if (error instanceof RateLimitError || (error as any)?.code === 'RATE_LIMITED')
    errorCode = 'RATE_LIMITED';
  if (message === 'NOT_FOUND') errorCode = 'NOT_FOUND';
  if (message === 'CONFLICT_VERSION') errorCode = 'CONFLICT_VERSION';

  if (isDbTimeoutError(error)) {
    meterDbTimeout(ctx.actor.orgId);
    const code = getDbTimeoutCode(error);
    if (code && process.env.NODE_ENV !== 'production') {
      console.warn(`[DB_TIMEOUT] ${code} org=${ctx.actor.orgId} requestId=${ctx.requestId}`);
    }
  }

  // Client-fault codes are deterministic: retrying unchanged will always fail.
  const CLIENT_FAULT_CODES = new Set<ErrorCode>([
    'VALIDATION_FAILED', 'POLICY_DENIED', 'LIFECYCLE_DENIED', 'NOT_FOUND', 'CONFLICT_VERSION',
  ]);
  const isClientFault = CLIENT_FAULT_CODES.has(errorCode);
  const status = isClientFault ? 'rejected' : 'error';

  // Stable, idempotent fingerprint for this specific error on this mutation.
  const errorId = `${errorCode}:${plan.mutationId}`;

  const baseFields = {
    requestId: ctx.requestId,
    mutationId: plan.mutationId,
    batchId: plan.validSpec.batchId,
    entityId: plan.verb === 'create' ? null : (plan.validSpec.entityRef.id ?? null),
    entityType: plan.validSpec.entityRef.type,
    versionBefore: null as null,
    versionAfter: null as null,
    auditLogId: null as null,
    errorId,
    errorCode,
  };

  let receipt: MutationReceipt;

  if (isClientFault) {
    receipt = { ...baseFields, status: 'rejected', isClientFault: true, retryable: false };
  } else {
    // Determine retryability details for server-side errors.
    let retryable = true;
    let retryAfterMs: number | undefined;
    let retryableReason: 'rate_limited' | 'db_timeout' | 'transient_error';

    if (errorCode === 'RATE_LIMITED') {
      retryableReason = 'rate_limited';
      if (error instanceof RateLimitError) retryAfterMs = error.resetMs;
    } else if (isDbTimeoutError(error)) {
      retryableReason = 'db_timeout';
    } else {
      retryableReason = 'transient_error';
    }

    receipt = {
      ...baseFields,
      status: 'error',
      isClientFault: false,
      retryable,
      ...(retryAfterMs !== undefined ? { retryAfterMs } : {}),
      retryableReason,
    };
  }

  if (status === 'error') {
    hooks.onMutationFailed(ctx, error instanceof Error ? error : new Error(message), durationMs);
  } else {
    hooks.onMutationRejected(ctx, errorCode, message);
  }

  return err(errorCode, message, ctx.requestId, receipt);
}
