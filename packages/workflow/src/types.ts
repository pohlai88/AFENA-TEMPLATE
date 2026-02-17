import type { ActorRef, MutationSpec } from 'afenda-canon';

// ── Rule Definition ─────────────────────────────────────────

/**
 * When a rule fires relative to the mutation.
 * - before: runs before the mutation transaction (can block or enrich)
 * - after: runs after the mutation commits (side effects only, cannot block)
 */
export type RuleTiming = 'before' | 'after';

/**
 * Outcome of a condition evaluation.
 */
export type ConditionResult = { match: true } | { match: false; reason: string };

/**
 * A condition function that determines whether a rule should fire.
 * Receives the mutation spec and the current entity snapshot (null on create).
 */
export type ConditionFn = (
  spec: MutationSpec,
  entity: Record<string, unknown> | null,
  ctx: RuleContext,
) => ConditionResult | Promise<ConditionResult>;

/**
 * Outcome of an action execution.
 */
export interface ActionResult {
  ok: boolean;
  message?: string | undefined;
  /** For 'before' rules: optionally mutate the input before it reaches the handler. */
  enrichedInput?: Record<string, unknown> | undefined;
}

/**
 * An action function that executes when a rule's conditions are met.
 * - Before rules can return enrichedInput to modify the mutation input.
 * - After rules execute side effects (notifications, cascading mutations, etc.).
 */
export type ActionFn = (
  spec: MutationSpec,
  entity: Record<string, unknown> | null,
  ctx: RuleContext,
) => ActionResult | Promise<ActionResult>;

/**
 * A workflow rule definition.
 */
export interface WorkflowRule {
  /** Unique rule identifier. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Optional description. */
  description?: string | undefined;
  /** When to fire: before or after the mutation. */
  timing: RuleTiming;
  /** Entity types this rule applies to (empty = all entities). */
  entityTypes: string[];
  /** Action verbs this rule applies to (empty = all verbs). */
  verbs: string[];
  /** Priority — lower numbers run first (default 100). */
  priority: number;
  /** Whether this rule is active. */
  enabled: boolean;
  /** Condition that must be true for the rule to fire. */
  condition: ConditionFn;
  /** Action to execute when the condition is met. */
  action: ActionFn;
}

// ── Rule Context ────────────────────────────────────────────

/**
 * Context passed to rule conditions and actions.
 * Uses ActorRef from afenda-canon to match MutationContext.actor.
 */
export interface RuleContext {
  requestId: string;
  actor: ActorRef;
  channel?: string | undefined;
}

// ── Engine Results ──────────────────────────────────────────

/**
 * Result of evaluating all rules for a given timing phase.
 */
export interface RuleEvaluationResult {
  /** Whether the mutation should proceed (only relevant for 'before' rules). */
  proceed: boolean;
  /** If blocked, the reason. */
  blockReason?: string | undefined;
  /** If any before-rule enriched the input, the merged result. */
  enrichedInput?: Record<string, unknown> | undefined;
  /** Log of which rules fired and their outcomes. */
  log: RuleExecutionLog[];
}

export interface RuleExecutionLog {
  ruleId: string;
  ruleName: string;
  timing: RuleTiming;
  conditionMatched: boolean;
  actionResult?: ActionResult | undefined;
  error?: string | undefined;
  durationMs: number;
}
