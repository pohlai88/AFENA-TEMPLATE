/**
 * Idempotency key persistence — Phase 6 implementation
 *
 * Provides dedup for mutate() calls with idempotencyKey set.
 * On duplicate: returns the stored Receipt without re-executing.
 *
 * Uses DB: idempotency_keys table with schema:
 *   org_id  uuid not null
 *   idempotency_key text not null  
 *   action_type text not null
 *   request_hash text not null
 *   receipt jsonb
 *   status text (in_flight, complete, failed)
 *   created_at timestamptz
 *   expires_at timestamptz
 *   UNIQUE (org_id, idempotency_key)
 *
 * See: INTEGRATION_PLAN.md Phase 2.7 — Idempotency persistence
 */

import { and, eq, idempotencyKeys, type DbTransaction } from 'afenda-database';

/**
 * Union type for mutation receipts (mirrors Canon's MutationReceipt).
 * Local definition avoids build cache issues across packages.
 */
type MutationReceiptBase = {
  requestId: string;
  mutationId: string;
  batchId?: string;
  entityId: string | null;
  entityType: string;
};

type MutationReceiptOk = MutationReceiptBase & {
  status: 'ok';
  entityId: string;
  versionBefore: number | null;
  versionAfter: number;
  auditLogId: string | null;
};

type MutationReceiptRejected = MutationReceiptBase & {
  status: 'rejected';
  versionBefore: null;
  versionAfter: null;
  auditLogId: null;
  errorId: string;
  errorCode: string;
  isClientFault: true;
  retryable: false;
};

type MutationReceiptError = MutationReceiptBase & {
  status: 'error';
  versionBefore: null;
  versionAfter: null;
  auditLogId: null;
  errorId: string;
  errorCode: string;
  isClientFault: false;
  retryable: boolean;
  retryAfterMs?: number;
  retryableReason?: string;
};

type MutationReceipt = MutationReceiptOk | MutationReceiptRejected | MutationReceiptError;

/** Result of idempotency check */
export type IdempotencyCheckResult =
  | { hit: true; receipt: MutationReceipt; status: string }
  | { hit: false; inFlight: false }
  | { hit: false; inFlight: true };

/**
 * Check if an idempotency key already exists.
 *
 * Returns:
 * - { hit: true, receipt, status } — duplicate request, return stored receipt
 * - { hit: false, inFlight: false } — new request, proceed with mutation
 * - { hit: false, inFlight: true } — concurrent request in progress, caller should retry later
 */
export async function checkIdempotency(
  tx: DbTransaction,
  params: { orgId: string; key: string; requestHash: string },
): Promise<IdempotencyCheckResult> {
  const [existing] = await tx
    .select({
      receipt: idempotencyKeys.receipt,
      status: idempotencyKeys.status,
      requestHash: idempotencyKeys.requestHash,
    })
    .from(idempotencyKeys)
    .where(
      and(
        eq(idempotencyKeys.orgId, params.orgId),
        eq(idempotencyKeys.idempotencyKey, params.key),
      ),
    )
    .limit(1);

  if (!existing) {
    return { hit: false, inFlight: false };
  }

  // Check if a different request body used the same key (tampering)
  if (existing.requestHash !== params.requestHash) {
    // Different body — treat as conflict. Caller should error.
    // Per K-10, we still return the original receipt (don't let new body sneak through).
    return {
      hit: true,
      receipt: existing.receipt as MutationReceipt,
      status: existing.status,
    };
  }

  if (existing.status === 'in_flight') {
    // Another request is currently processing this key
    return { hit: false, inFlight: true };
  }

  // Complete or failed — return stored receipt
  return {
    hit: true,
    receipt: existing.receipt as MutationReceipt,
    status: existing.status,
  };
}

/**
 * Lock an idempotency key as "in_flight" before executing the mutation.
 *
 * Uses INSERT with ON CONFLICT DO NOTHING to prevent races.
 * Returns true if lock acquired, false if key already exists.
 */
export async function lockIdempotencyKey(
  tx: DbTransaction,
  params: {
    orgId: string;
    key: string;
    actionType: string;
    requestHash: string;
    ttlMs: number;
  },
): Promise<boolean> {
  const expiresAt = new Date(Date.now() + params.ttlMs);

  const result = await tx
    .insert(idempotencyKeys)
    .values({
      orgId: params.orgId,
      idempotencyKey: params.key,
      actionType: params.actionType,
      requestHash: params.requestHash,
      status: 'in_flight',
      receipt: null,
      expiresAt,
    })
    .onConflictDoNothing()
    .returning({ id: idempotencyKeys.id });

  return result.length > 0;
}

/**
 * Complete an idempotency key by storing the final receipt.
 *
 * Called after successful commit to persist the receipt for replay.
 */
export async function completeIdempotencyKey(
  tx: DbTransaction,
  params: {
    orgId: string;
    key: string;
    receipt: MutationReceipt;
    status?: 'complete' | 'failed';
  },
): Promise<void> {
  await tx
    .update(idempotencyKeys)
    .set({
      receipt: params.receipt,
      status: params.status ?? 'complete',
    })
    .where(
      and(
        eq(idempotencyKeys.orgId, params.orgId),
        eq(idempotencyKeys.idempotencyKey, params.key),
      ),
    );
}

/**
 * Write a complete idempotency record in a single operation.
 *
 * Used when the mutation completes synchronously within the same transaction.
 * Combines lock + complete into atomic insert-or-update.
 */
export async function writeIdempotencyKey(
  tx: DbTransaction,
  params: {
    orgId: string;
    key: string;
    actionType: string;
    requestHash: string;
    receipt: MutationReceipt;
    ttlMs: number;
  },
): Promise<void> {
  const expiresAt = new Date(Date.now() + params.ttlMs);

  await tx
    .insert(idempotencyKeys)
    .values({
      orgId: params.orgId,
      idempotencyKey: params.key,
      actionType: params.actionType,
      requestHash: params.requestHash,
      status: 'complete',
      receipt: params.receipt,
      expiresAt,
    })
    .onConflictDoNothing(); // If already exists, leave it (first-writer-wins)
}
