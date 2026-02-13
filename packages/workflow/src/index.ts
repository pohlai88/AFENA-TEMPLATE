// ── Engine ──────────────────────────────────────────────────
export { evaluateRules } from './engine';

// ── Registry ────────────────────────────────────────────────
export { registerRule, unregisterRule, getRegisteredRules, clearRules, unregisterByPrefix } from './registry';

// ── Built-in Conditions ─────────────────────────────────────
export { always, never, fieldEquals, fieldChanged, actorHasRole, allOf, anyOf } from './conditions';

// ── Interpreter (JSON → ConditionFn / ActionFn) ─────────────
export { interpretCondition, interpretAction } from './interpreter';

// ── DB Loader (per-org rules, TTL-cached) ───────────────────
export { loadAndRegisterOrgRules } from './db-loader';

// ── Types ───────────────────────────────────────────────────
export type {
  RuleTiming,
  ConditionResult,
  ConditionFn,
  ActionResult,
  ActionFn,
  WorkflowRule,
  RuleContext,
  RuleEvaluationResult,
  RuleExecutionLog,
} from './types';

// ── V2: Contracted Workflow Envelope ────────────────────────
export * from './v2';
