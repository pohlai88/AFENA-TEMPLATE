/**
 * Pipeline types for the Mutation Kernel (Phase 4)
 *
 * PreparedMutation — output of buildMutationPlan(), input to commitPlan()
 * CommitResult     — output of commitPlan(), consumed by deliverEffects()
 *
 * These are strictly internal to the CRUD package and must NOT be exported
 * from packages/crud's public barrel (packages/crud/src/index.ts).
 *
 * @see INTEGRATION_PLAN.md §4
 */

import type { AuthoritySnapshotV2, MutationReceipt, MutationSpec } from 'afenda-canon';
import type { EntityHandler } from '../handlers/types';

/**
 * Intra-phase DTO: everything the Commit phase needs that was computed during
 * the Plan phase (before any DB writes).
 *
 * Invariants:
 *   - mutationId is a freshly generated UUID (collision probability negligible)
 *   - sanitizedInput has passed K-11 (system-column strip), SER-01 (coercion),
 *     and K-15 (FieldPolicyEngine) by the time this is constructed
 *   - handler is the resolved EntityHandler for validSpec.entityRef.type
 *   - targetRow is null iff verb === 'create'
 */
export interface PreparedMutation {
  readonly mutationId: string;
  readonly verb: string;
  readonly validSpec: MutationSpec;
  /** Final sanitized input — safe to pass to Drizzle after K-11 + SER-01 + K-15 */
  readonly sanitizedInput: Record<string, unknown> | unknown;
  readonly handler: EntityHandler;
  readonly targetRow: Record<string, unknown> | null;
  /** Narrowed entity ID — defined iff verb !== 'create' */
  readonly entityId: string | undefined;
  /** Narrowed expected version — defined iff verb !== 'create' */
  readonly expectedVer: number | undefined;
  readonly authoritySnapshot: AuthoritySnapshotV2;
}

/**
 * Result produced by commitPlan() — carries handler output + receipt.
 * Used by deliverEffects() and returned upstream to build the ApiResponse.
 */
export interface CommitResult {
  readonly handlerResult: {
    before: Record<string, unknown> | null;
    after: Record<string, unknown> | null;
    entityId: string;
    versionBefore: number | null;
    versionAfter: number;
  };
  /** The inserted audit_log row — undefined if the insert failed silently */
  readonly auditRow: { id: string } | undefined;
  readonly receipt: MutationReceipt;
}
