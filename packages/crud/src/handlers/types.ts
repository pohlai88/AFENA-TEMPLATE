import type { MutationPlan } from 'afenda-canon';
import type { DbTransaction } from 'afenda-database';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { MutationContext } from '../context';

/**
 * Internal handler result — returned by entity-specific handlers.
 * NEVER exported from packages/crud (K-05).
 */
export interface HandlerResult {
  entityId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown>;
  versionBefore: number | null;
  versionAfter: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// v1.0 — Verb-based handler (legacy, still in use for companies + contacts)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * v1.0 handler interface — verb-based. Used by companies.ts and contacts.ts.
 * Wrap with adaptV10Handler() to use in the v1.1 pipeline.
 * @see handlers/compat-adapter.ts
 */
export interface EntityHandlerV10 {
  create(
    tx: NeonHttpDatabase,
    input: Record<string, unknown>,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  update(
    tx: NeonHttpDatabase,
    entityId: string,
    input: Record<string, unknown>,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  delete(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  restore(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  submit?(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  cancel?(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  amend?(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  approve?(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  reject?(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;
}

// ─────────────────────────────────────────────────────────────────────────────
// v1.1 — Phase-hook handler (Phase 3 target)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Context object passed to Plan phase hooks.
 * Read-only — no DB access allowed in plan hooks.
 */
export interface PlanContext {
  orgId: string;
  requestId: string;
  ctx: MutationContext;
}

/**
 * Result returned by plan hooks.
 */
export interface PlannedMutation {
  /** Sanitized, field-policy-enforced input */
  sanitizedInput: Record<string, unknown>;
  /** Additional outbox intents beyond the standard workflow/search intents */
  outboxIntents?: import('afenda-canon').OutboxIntent[];
}

/**
 * v1.1 handler interface — phase-hook-based.
 *
 * Plan hooks: pure validation, no DB writes. Return sanitized input + custom intents.
 * Commit hook: DB-only, runs inside the mutation transaction after entity write.
 *
 * Entities that don't need custom logic use createBaseHandler() which
 * delegates entirely to the kernel pipeline.
 */
export interface EntityHandlerV11 {
  /** Used to distinguish v1.1 handlers at runtime */
  readonly __v11: true;

  entityType: string;

  // ── Plan hooks (no DB writes) ─────────────────────────
  planCreate?: (ctx: PlanContext, input: Record<string, unknown>) => Promise<PlannedMutation>;
  planUpdate?: (ctx: PlanContext, current: Record<string, unknown>, input: Record<string, unknown>) => Promise<PlannedMutation>;
  planDelete?: (ctx: PlanContext, current: Record<string, unknown>) => Promise<PlannedMutation>;
  planRestore?: (ctx: PlanContext, current: Record<string, unknown>) => Promise<PlannedMutation>;

  // ── Commit hook (DB-only, inside TX) ─────────────────
  /**
   * Called AFTER the entity row is written, inside the same transaction.
   * Use for writing related rows (subsidiary links, allocations, etc.).
   * K-12: Never do external IO here.
   */
  commitAfterEntityWrite?: (
    tx: DbTransaction,
    plan: MutationPlan,
    written: Record<string, unknown>,
  ) => Promise<void>;

  /**
   * Override the allowlist of writable fields.
   * Prefer Canon EntityContract.writeRules when possible.
   * Only use this for truly entity-specific logic.
   */
  pickWritableFields?: (verb: string, input: Record<string, unknown>) => Record<string, unknown>;
}

/**
 * Union type — any handler accepted by the handler registry.
 * The kernel dispatches differently based on __v11 discriminant.
 */
export type EntityHandler = EntityHandlerV10 | EntityHandlerV11;

/**
 * Type guard for v1.1 handlers.
 */
export function isV11Handler(h: EntityHandler): h is EntityHandlerV11 {
  return '__v11' in h && (h as EntityHandlerV11).__v11 === true;
}

