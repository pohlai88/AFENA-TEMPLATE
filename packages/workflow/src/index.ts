// ── Engine ──────────────────────────────────────────────────
export { evaluateRules } from './engine';

// ── Registry ────────────────────────────────────────────────
export { registerRule, unregisterRule, getRegisteredRules, clearRules } from './registry';

// ── Built-in Conditions ─────────────────────────────────────
export { always, never, fieldEquals, fieldChanged, actorHasRole, allOf, anyOf } from './conditions';

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
