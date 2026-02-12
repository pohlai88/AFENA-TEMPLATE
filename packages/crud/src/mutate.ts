import {
  extractEntityNamespace,
  extractVerb,
  getActionFamily,
  mutationSpecSchema,
} from 'afena-canon';
import { and, auditLogs, db, entityVersions, eq } from 'afena-database';
import { evaluateRules, loadAndRegisterOrgRules } from 'afena-workflow';

import { generateDiff } from './diff';
import { err, ok } from './envelope';
import { contactsHandler } from './handlers/contacts';
import { enforcePolicy } from './policy';
import { stripSystemColumns } from './sanitize';

import type { MutationContext } from './context';
import type { EntityHandler } from './handlers/types';
import type { ApiResponse, ErrorCode, MutationSpec, Receipt } from 'afena-canon';

/** Entity handler registry — maps entity type to handler. */
const HANDLER_REGISTRY: Record<string, EntityHandler> = {
  contacts: contactsHandler,
};

/**
 * K-01: mutate() is the ONLY way to write domain data.
 * K-02: runs in a single DB transaction.
 * K-03: ALWAYS writes audit_logs + entity_versions.
 * K-05: one of only 3 public exports from packages/crud.
 */
export async function mutate(
  spec: MutationSpec,
  ctx: MutationContext,
): Promise<ApiResponse> {
  const mutationId = crypto.randomUUID();

  // 1. Validate MutationSpec with Zod
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

  // K-15: actionType namespace must match entityRef.type
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

  // 2. Strip system columns (K-11 backstop)
  const sanitizedInput = typeof validSpec.input === 'object' && validSpec.input !== null && !Array.isArray(validSpec.input)
    ? stripSystemColumns(validSpec.input as Record<string, unknown>)
    : validSpec.input;

  // 3. Enforce expectedVersion rules (K-04)
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
  const entityId = validSpec.entityRef.id;
  const expectedVer = validSpec.expectedVersion;

  // 4. Check idempotencyKey for duplicate create prevention (K-10)
  if (validSpec.idempotencyKey && verb === 'create') {
    const existing = await db
      .select()
      .from(auditLogs)
      .where(
        and(
          eq(auditLogs.actionType, validSpec.actionType),
          eq(auditLogs.idempotencyKey, validSpec.idempotencyKey),
        ),
      )
      .limit(1);

    const existingRow = existing[0];
    if (existingRow) {
      const replayReceipt: Receipt = {
        requestId: ctx.requestId,
        mutationId: existingRow.mutationId,
        batchId: validSpec.batchId,
        entityId: existingRow.entityId,
        entityType: validSpec.entityRef.type,
        versionBefore: null,
        versionAfter: existingRow.versionAfter,
        status: 'ok',
        auditLogId: existingRow.id,
        errorCode: undefined,
      };
      return ok(null, ctx.requestId, replayReceipt);
    }
  }

  // 5. Evaluate policy (RBAC hard gate — INVARIANT-07)
  const { authoritySnapshot } = enforcePolicy(validSpec as MutationSpec, ctx);

  // 5b. Load DB-driven workflow rules for this org (TTL-cached)
  await loadAndRegisterOrgRules(ctx.actor.orgId);

  // 6. Evaluate before-rules (can block or enrich input)
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

  // 7. Resolve handler
  const handler = HANDLER_REGISTRY[validSpec.entityRef.type];
  if (!handler) {
    return err(
      'VALIDATION_FAILED',
      `No handler registered for entity type '${validSpec.entityRef.type}'`,
      ctx.requestId,
      buildRejectedReceipt(ctx.requestId, mutationId, spec),
    );
  }

  // 7-16. Transaction: mutation + audit + version
  try {
    const result = await db.transaction(async (tx) => {
      let handlerResult;

      switch (verb) {
        case 'create':
          handlerResult = await handler.create(
            tx as any,
            sanitizedInput as Record<string, unknown>,
            ctx,
          );
          break;
        case 'update':
          handlerResult = await handler.update(
            tx as any,
            entityId as string,
            sanitizedInput as Record<string, unknown>,
            expectedVer as number,
            ctx,
          );
          break;
        case 'delete':
          handlerResult = await handler.delete(
            tx as any,
            entityId as string,
            expectedVer as number,
            ctx,
          );
          break;
        case 'restore':
          handlerResult = await handler.restore(
            tx as any,
            entityId as string,
            expectedVer as number,
            ctx,
          );
          break;
        default:
          throw new Error(`Unsupported verb: ${verb}`);
      }

      // Generate diff (K-13: normalized snapshots)
      const diff = generateDiff(handlerResult.before, handlerResult.after);

      // Insert entity_versions row (K-03)
      await (tx as any).insert(entityVersions).values({
        orgId: ctx.actor.orgId,
        entityType: validSpec.entityRef.type,
        entityId: handlerResult.entityId,
        version: handlerResult.versionAfter,
        parentVersion: handlerResult.versionBefore,
        snapshot: handlerResult.after,
        diff,
        createdBy: ctx.actor.userId,
      });

      // Insert audit_logs row (K-03)
      const [auditRow] = await (tx as any)
        .insert(auditLogs)
        .values({
          orgId: ctx.actor.orgId,
          actorUserId: ctx.actor.userId,
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

      return { handlerResult, auditRow };
    });

    // Build success receipt
    const receipt: Receipt = {
      requestId: ctx.requestId,
      mutationId,
      batchId: validSpec.batchId,
      entityId: result.handlerResult.entityId,
      entityType: validSpec.entityRef.type,
      versionBefore: result.handlerResult.versionBefore,
      versionAfter: result.handlerResult.versionAfter,
      status: 'ok',
      auditLogId: result.auditRow?.id ?? null,
    };

    // Evaluate after-rules (side effects only, cannot block)
    // Fire-and-forget: errors are logged but don't fail the mutation
    evaluateRules('after', validSpec as MutationSpec, result.handlerResult.after, {
      requestId: ctx.requestId,
      actor: ctx.actor,
      channel: ctx.channel,
    }).catch(() => {
      // After-rule errors are swallowed — they must not affect the mutation response
    });

    return ok(result.handlerResult.after, ctx.requestId, receipt);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    // Map handler errors to deterministic error codes
    let errorCode: ErrorCode = 'INTERNAL_ERROR';
    if ((error as any)?.code === 'POLICY_DENIED') errorCode = 'POLICY_DENIED';
    if (message === 'NOT_FOUND') errorCode = 'NOT_FOUND';
    if (message === 'CONFLICT_VERSION') errorCode = 'CONFLICT_VERSION';

    const status = errorCode === 'INTERNAL_ERROR' ? 'error' : 'rejected';

    const receipt: Receipt = {
      requestId: ctx.requestId,
      mutationId,
      batchId: validSpec.batchId,
      entityId: verb === 'create' ? null : (validSpec.entityRef.id ?? null),
      entityType: validSpec.entityRef.type,
      versionBefore: null,
      versionAfter: null,
      status,
      auditLogId: null,
      errorCode,
    };

    return err(errorCode, message, ctx.requestId, receipt);
  }
}

/** Build a rejected receipt for pre-transaction failures (K-12). */
function buildRejectedReceipt(
  requestId: string,
  mutationId: string,
  spec: MutationSpec,
): Receipt {
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
    errorCode: 'VALIDATION_FAILED',
  };
}

