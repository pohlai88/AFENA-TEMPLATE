/**
 * Observability Hooks — Phase 5 (K-09)
 *
 * A lightweight hook system that lets the host application attach structured
 * observability callbacks to the mutation lifecycle without coupling afenda-crud
 * to any specific tracing or metrics library (OpenTelemetry, Datadog, Pino, …).
 *
 * All hooks are synchronous fire-and-forget from the mutation kernel's
 * perspective — the kernel never awaits them, and a throwing hook MUST NOT
 * propagate (wrap in try/catch if your hook can throw).
 *
 * Usage:
 *   import { setObservabilityHooks } from 'afenda-crud';
 *   setObservabilityHooks({
 *     onMutationStart: (ctx, spec) => span.start({ ... }),
 *     onMutationCommitted: (ctx, receipt, ms) => histogram.record(ms),
 *   });
 *
 * @see INTEGRATION_PLAN.md §5.2 — observability-hooks.ts
 */

import type { MutationReceipt, MutationSpec } from 'afenda-canon';
import type { MutationContext } from './context';

// ─────────────────────────────────────────────────────────────────────────────
// Hook interface
// ─────────────────────────────────────────────────────────────────────────────

export interface ObservabilityHooks {
  /**
   * Fired immediately after `mutate()` is entered — before plan building.
   * Use for span start / request tagging.
   */
  onMutationStart(ctx: MutationContext, spec: MutationSpec): void;

  /**
   * Fired when the mutation TX commits and the receipt is produced.
   * `durationMs` is elapsed time from `mutate()` entry to TX commit.
   */
  onMutationCommitted(ctx: MutationContext, receipt: MutationReceipt, durationMs: number): void;

  /**
   * Fired when the mutation is rejected by a guard (policy, lifecycle,
   * rate limit, validation, etc.) BEFORE reaching the DB write.
   * `errorCode` is the canonical error code; `reason` is the human message.
   */
  onMutationRejected(ctx: MutationContext, errorCode: string, reason: string): void;

  /**
   * Fired when an unexpected (non-rejection) error escapes from
   * `commitPlan()` — e.g. DB timeout, internal error.
   * `durationMs` is elapsed time from `mutate()` entry to error.
   */
  onMutationFailed(ctx: MutationContext, error: Error, durationMs: number): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// No-op default — safe to call at startup with no host configuration
// ─────────────────────────────────────────────────────────────────────────────

const noopHooks: ObservabilityHooks = {
  onMutationStart: () => {},
  onMutationCommitted: () => {},
  onMutationRejected: () => {},
  onMutationFailed: () => {},
};

let _hooks: ObservabilityHooks = noopHooks;

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Install observability hooks. Call once at application startup.
 * Partial implementations are merged with no-ops for any unspecified hooks.
 *
 * @param impl - Partial hook implementation from the host application
 */
export function setObservabilityHooks(impl: Partial<ObservabilityHooks>): void {
  _hooks = { ...noopHooks, ...impl };
}

/**
 * Returns the currently installed hook set.
 * Used internally by `mutate.ts`.
 */
export function getObservabilityHooks(): ObservabilityHooks {
  return _hooks;
}
