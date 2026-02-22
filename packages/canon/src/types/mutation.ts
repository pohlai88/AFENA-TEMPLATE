import type { ActionType, ActionVerb } from './action';
import type { ActorRef } from './actor';
import type { EntityRef } from './entity';
import type { ApiResponse } from './envelope';
import type { OutboxIntent } from './events';

/** JSON-compatible value for mutation input payloads. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * Single normalized mutation contract.
 * This is the only shape accepted by mutate().
 *
 * K-04: expectedVersion required on update/delete/restore.
 * K-09: entityRef.id optional on create (kernel generates UUID).
 * K-10: idempotencyKey for *.create only.
 */
export interface MutationSpec {
  actionType: ActionType;
  entityRef: EntityRef;
  input: JsonValue;
  expectedVersion?: number;
  batchId?: string;
  reason?: string;
  idempotencyKey?: string;
}

/**
 * MutationPlan — SSOT value produced by the Plan phase.
 *
 * Carries everything the Commit phase needs to execute atomically:
 * - sanitized input (after field policy + coercion)
 * - explicit write analysis for governance + debugging (K-15 traceability)
 * - policy decision from RBAC + lifecycle checks
 * - outbox intents to write inside the transaction (K-12)
 * - idempotency key for replay detection (K-10)
 *
 * The Plan phase MUST NOT write to the database. The Commit phase
 * executes ALL writes (entity + audit + outbox) in a single transaction.
 */
export interface MutationPlan {
  // ── Identity ─────────────────────────────────────────
  requestId: string;
  mutationBatchId?: string;
  entityRef: { orgId: string; type: string; id: string };
  verb: ActionVerb;
  actor: Pick<ActorRef, 'userId' | 'name'>;

  // ── State ─────────────────────────────────────────────
  /** Entity state before mutation (null for create) */
  current?: Record<string, unknown>;
  /** Sanitized, coerced input — safe to pass directly to Drizzle */
  sanitizedInput: Record<string, unknown>;

  // ── Write Analysis (K-15 traceability) ────────────────
  writeSet: {
    /** Fields that passed field policy and will be written */
    allowed: string[];
    /** Fields silently stripped (serverOwned, computed) */
    stripped: string[];
    /** Fields rejected with a violation reason */
    rejected?: Array<{ field: string; rule: string; reason: string }>;
  };

  // ── Policy ────────────────────────────────────────────
  policyDecision: {
    allowed: boolean;
    capabilities: string[];
    scopes: string[];
    reasonCodes: string[];
  };

  // ── Invariants Checked ────────────────────────────────
  /** Kernel contract IDs verified during planning (e.g. ['K-04', 'K-07', 'K-15']) */
  invariantsChecked: string[];

  // ── Side Effects ──────────────────────────────────────
  /** Outbox intents to write atomically in the Commit transaction (K-12) */
  outboxIntents: OutboxIntent[];
  /** Idempotency key for replay detection (K-10) */
  idempotencyKey?: string;

  // ── Rejection (plan rejected before commit) ───────────
  rejected?: boolean;
  rejection?: ApiResponse;
}

