/**
 * buildMutationPlan — Plan Phase of the Mutation Kernel (Phase 4)
 *
 * Validates the MutationSpec, resolves the handler + target row, and runs all
 * pre-condition checks. MUST NOT write to the database.
 *
 * Returns either:
 *   - ApiResponse — early rejection (validation error) or idempotency replay
 *   - PreparedMutation — all data needed by commitPlan()
 *
 * Throws:
 *   - RateLimitError — rate limit exceeded (INVARIANT-RL-01)
 *   - Any uncaught error from enforceLifecycle / enforceEditWindow / enforcePolicyV2
 *
 * @see INTEGRATION_PLAN.md §4.1
 */

import {
  coerceMutationInput,
  ENTITY_CONTRACT_REGISTRY,
  extractEntityNamespace,
  extractVerb,
  getContract,
  hasContract,
  isSystemChannel,
  mutationSpecSchema,
  RateLimitError,
} from 'afenda-canon';
import { and, auditLogs, eq, getTableForEntityType } from 'afenda-database';
import { evaluateRules, loadAndRegisterOrgRules } from 'afenda-workflow';

import type { ApiResponse, MutationReceiptOk, MutationReceiptRejected, MutationSpec } from 'afenda-canon';
import { withReadSession } from '../commit/session';
import type { MutationContext } from '../context';
import { HANDLER_REGISTRY } from '../registries/handler-registry';
import { err, ok } from '../util/envelope';
import { enforceEditWindow } from './enforce/edit-window';
import { enforceFieldWritePolicy } from './enforce/field-write';
import { enforceLifecycle } from './enforce/lifecycle';
import { enforcePolicyV2 } from './enforce/policy';
import { checkRateLimit } from './enforce/rate-limiter';
import type { PreparedMutation } from './prepared-mutation';
import { stripSystemColumns } from './sanitize-input';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Build a rejected receipt for pre-transaction failures. */
function buildRejectedReceipt(requestId: string, mutationId: string, spec: MutationSpec): MutationReceiptRejected {
  const verb = extractVerb(spec.actionType);
  return {
    requestId,
    mutationId,
    batchId: spec.batchId,
    entityId: verb === 'create' ? null : (spec.entityRef.id ?? null),
    entityType: spec.entityRef.type,
    versionBefore: null,
    versionAfter: null,
    status: 'rejected',
    auditLogId: null,
    errorId: `VALIDATION_FAILED:${mutationId}`,
    errorCode: 'VALIDATION_FAILED',
    isClientFault: true,
    retryable: false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Plan Phase Entry Point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute the Plan phase: validate → resolve → pre-condition checks.
 *
 * Early returns: validation errors, idempotency replay.
 * Success: returns a PreparedMutation ready for commitPlan().
 */
export async function buildMutationPlan(
  spec: MutationSpec,
  ctx: MutationContext,
): Promise<ApiResponse | PreparedMutation> {
  const mutationId = crypto.randomUUID();

  // ── 0. Rate limit (INVARIANT-RL-01) ───────────────────────────────────────
  const rlResult = checkRateLimit(ctx.actor.orgId, 'mutation');
  if (!rlResult.allowed) {
    throw new RateLimitError(rlResult.remaining, rlResult.resetMs);
  }

  // ── 1. Validate MutationSpec ───────────────────────────────────────────────
  const parsed = mutationSpecSchema.safeParse(spec);
  if (!parsed.success) {
    return err(
      'VALIDATION_FAILED',
      parsed.error.message,
      ctx.requestId,
      buildRejectedReceipt(ctx.requestId, mutationId, spec),
    );
  }
  const validSpec = parsed.data;

  // ── 2a. Namespace guard ────────────────────────────────────────────────────
  const entityNamespace = extractEntityNamespace(validSpec.actionType);
  if (entityNamespace !== validSpec.entityRef.type) {
    return err(
      'VALIDATION_FAILED',
      `actionType namespace '${entityNamespace}' does not match entityRef.type '${validSpec.entityRef.type}'`,
      ctx.requestId,
      buildRejectedReceipt(ctx.requestId, mutationId, spec),
    );
  }

  const verb = extractVerb(validSpec.actionType);

  // ── 2b. Sanitize + coerce (K-11 + SER-01) ────────────────────────────────
  // eslint-disable-next-line prefer-const
  let sanitizedInput =
    typeof validSpec.input === 'object' &&
      validSpec.input !== null &&
      !Array.isArray(validSpec.input)
      ? coerceMutationInput(stripSystemColumns(validSpec.input as Record<string, unknown>))
      : validSpec.input;

  // ── 3. expectedVersion rules (K-04) ───────────────────────────────────────
  if (verb === 'create') {
    if (validSpec.expectedVersion !== undefined) {
      return err(
        'VALIDATION_FAILED',
        'expectedVersion must not be provided for create operations',
        ctx.requestId,
        buildRejectedReceipt(ctx.requestId, mutationId, spec),
      );
    }
    if (validSpec.entityRef.id !== undefined) {
      return err(
        'VALIDATION_FAILED',
        'entityRef.id must not be provided for create operations (kernel generates UUID)',
        ctx.requestId,
        buildRejectedReceipt(ctx.requestId, mutationId, spec),
      );
    }
  } else {
    if (validSpec.expectedVersion === undefined) {
      return err(
        'VALIDATION_FAILED',
        `expectedVersion is required for ${verb} operations`,
        ctx.requestId,
        buildRejectedReceipt(ctx.requestId, mutationId, spec),
      );
    }
    if (!validSpec.entityRef.id) {
      return err(
        'VALIDATION_FAILED',
        `entityRef.id is required for ${verb} operations`,
        ctx.requestId,
        buildRejectedReceipt(ctx.requestId, mutationId, spec),
      );
    }
  }

  // Narrowed locals — guards above guarantee these are defined for non-create verbs
  const entityId = validSpec.entityRef.id as string | undefined;
  const expectedVer = validSpec.expectedVersion;

  // ── 4. Idempotency check (K-10) ───────────────────────────────────────────
  if (validSpec.idempotencyKey && verb === 'create') {
    const existingRow = await withReadSession(ctx, async (db) => {
      const rows = await db
        .select()
        .from(auditLogs)
        .where(
          and(
            eq(auditLogs.actionType, validSpec.actionType),
            eq(auditLogs.idempotencyKey, validSpec.idempotencyKey!),
          ),
        )
        .limit(1);
      return rows[0] ?? null;
    });

    if (existingRow) {
      const replayReceipt: MutationReceiptOk = {
        requestId: ctx.requestId,
        mutationId: existingRow.mutationId,
        batchId: validSpec.batchId,
        entityId: existingRow.entityId,
        entityType: validSpec.entityRef.type,
        versionBefore: null,
        versionAfter: existingRow.versionAfter,
        status: 'ok',
        auditLogId: existingRow.id,
      };
      return ok(null, ctx.requestId, replayReceipt);
    }
  }

  // ── 5. Resolve handler (fail fast) ────────────────────────────────────────
  const handler = HANDLER_REGISTRY[validSpec.entityRef.type];
  if (!handler) {
    return err(
      'VALIDATION_FAILED',
      `No handler registered for entity type '${validSpec.entityRef.type}'`,
      ctx.requestId,
      buildRejectedReceipt(ctx.requestId, mutationId, spec),
    );
  }

  // ── 6. Resolve target row ─────────────────────────────────────────────────
  let targetRow: Record<string, unknown> | null = null;
  if (verb !== 'create' && entityId) {
    let table: any;
    try {
      table = getTableForEntityType(validSpec.entityRef.type);
    } catch {
      table = null;
    }
    if (table) {
      targetRow = await withReadSession(ctx, async (db) => {
        const [row] = await db.select().from(table).where(eq(table.id, entityId)).limit(1);
        return row ? (row as Record<string, unknown>) : null;
      });
    }
  }

  // ── 7. enforceLifecycle (INVARIANT-LIFECYCLE-01) ──────────────────────────
  enforceLifecycle(validSpec as MutationSpec, verb, targetRow);

  // ── 7a. enforcePostingLock (ERP Safety) ───────────────────────────────────
  // Prevent mutations to posted financial documents
  enforcePostingLock(targetRow, verb, ctx);

  // ── 7b. enforceEditWindow ─────────────────────────────────────────────────
  if (verb !== 'create' && entityId) {
    await enforceEditWindow(validSpec.entityRef.type, entityId, verb, ctx);
  }

  // ── 8. enforcePolicyV2 — DB-backed RBAC (INVARIANT-POLICY-01) ────────────
  const { authoritySnapshot } = await enforcePolicyV2(
    validSpec as MutationSpec,
    ctx,
    verb,
    targetRow,
  );

  // ── 9. Load org workflow rules (TTL-cached) ────────────────────────────────
  await loadAndRegisterOrgRules(ctx.actor.orgId);

  // ── 10. Evaluate before-rules (can block or enrich input) ─────────────────
  const beforeResult = await evaluateRules('before', validSpec as MutationSpec, null, {
    requestId: ctx.requestId,
    actor: ctx.actor,
    channel: ctx.channel,
  });

  if (!beforeResult.proceed) {
    return err(
      'VALIDATION_FAILED',
      beforeResult.blockReason ?? 'Blocked by workflow rule',
      ctx.requestId,
      buildRejectedReceipt(ctx.requestId, mutationId, spec),
    );
  }

  // Merge enriched input from before-rules
  if (beforeResult.enrichedInput && typeof sanitizedInput === 'object' && sanitizedInput !== null) {
    Object.assign(sanitizedInput, beforeResult.enrichedInput);
  }

  // ── K-15: FieldPolicyEngine (INTEGRATION_PLAN §3.6) ──────────────────────
  // Runs last in Plan phase: after enrichment + with actor context from policy.
  if (
    typeof sanitizedInput === 'object' &&
    sanitizedInput !== null &&
    hasContract(ENTITY_CONTRACT_REGISTRY, validSpec.entityRef.type)
  ) {
    const contract = getContract(ENTITY_CONTRACT_REGISTRY, validSpec.entityRef.type);
    if (contract?.writeRules) {
      const isSystemContext = ctx.channel != null && isSystemChannel(ctx.channel);
      const fieldResult = enforceFieldWritePolicy(
        contract.writeRules,
        verb,
        sanitizedInput as Record<string, unknown>,
        targetRow ?? undefined,
        isSystemContext,
      );
      if (fieldResult.violations.length > 0) {
        return err(
          'VALIDATION_FAILED',
          `Field policy violations: ${fieldResult.violations.map((v) => v.reason).join('; ')}`,
          ctx.requestId,
          buildRejectedReceipt(ctx.requestId, mutationId, spec),
        );
      }
      sanitizedInput = fieldResult.sanitizedInput;
    }
  }

  // ── Return PreparedMutation ───────────────────────────────────────────────
  const prepared: PreparedMutation = {
    mutationId,
    verb,
    validSpec: validSpec as MutationSpec,
    sanitizedInput,
    handler,
    targetRow,
    entityId,
    expectedVer,
    authoritySnapshot,
  };
  return prepared;
}
