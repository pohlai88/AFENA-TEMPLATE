import type { RuleCheck, RuleCheckResult } from '../types';

/**
 * Rule detector — evaluates hard business invariants against current data.
 * Each rule is a pure function: data in → result out.
 *
 * Rules are registered and evaluated in order. Each produces a RuleCheckResult
 * that can be converted to an advisory by the writer.
 */

/** Registry of rule checks. */
const ruleRegistry: RuleCheck[] = [];

/** Register a business rule check. */
export function registerRuleCheck(rule: RuleCheck): void {
  if (ruleRegistry.some((r) => r.id === rule.id)) {
    throw new Error(`Rule check '${rule.id}' already registered`);
  }
  ruleRegistry.push(rule);
}

/** Unregister a rule check by ID. */
export function unregisterRuleCheck(id: string): void {
  const idx = ruleRegistry.findIndex((r) => r.id === id);
  if (idx >= 0) ruleRegistry.splice(idx, 1);
}

/** Get all registered rule checks. */
export function getRegisteredRuleChecks(): readonly RuleCheck[] {
  return ruleRegistry;
}

/** Clear all registered rule checks. */
export function clearRuleChecks(): void {
  ruleRegistry.length = 0;
}

/**
 * Evaluate all registered rule checks against the provided data.
 * Returns only triggered results.
 */
export function evaluateRuleChecks(data: Record<string, unknown>): RuleCheckResult[] {
  return ruleRegistry
    .map((rule) => rule.evaluate(data))
    .filter((result) => result.triggered);
}

// ── Built-in Rule Factories ─────────────────────────────────

/**
 * Create a credit limit proximity rule.
 * Triggers when current balance / limit exceeds the threshold ratio.
 */
export function creditLimitRule(opts: {
  id: string;
  name: string;
  thresholdRatio: number; // e.g. 0.9 = 90%
}): RuleCheck {
  return {
    id: opts.id,
    name: opts.name,
    evaluate: (data) => {
      const balance = Number(data['balance'] ?? 0);
      const limit = Number(data['creditLimit'] ?? 0);
      if (limit <= 0) {
        return { triggered: false, ruleId: opts.id, ruleName: opts.name, message: '', score: null, metadata: {} };
      }
      const ratio = balance / limit;
      const triggered = ratio >= opts.thresholdRatio;
      return {
        triggered,
        ruleId: opts.id,
        ruleName: opts.name,
        message: triggered
          ? `At ${(ratio * 100).toFixed(0)}% of credit limit ($${balance.toFixed(2)} / $${limit.toFixed(2)})`
          : '',
        score: ratio,
        metadata: { balance, limit, ratio },
      };
    },
  };
}

/**
 * Create an aging threshold rule.
 * Triggers when the count of items exceeding the age threshold meets the minimum.
 */
export function agingThresholdRule(opts: {
  id: string;
  name: string;
  ageDays: number;
  minCount: number;
}): RuleCheck {
  return {
    id: opts.id,
    name: opts.name,
    evaluate: (data) => {
      const overdueCount = Number(data['overdueCount'] ?? 0);
      const triggered = overdueCount >= opts.minCount;
      return {
        triggered,
        ruleId: opts.id,
        ruleName: opts.name,
        message: triggered
          ? `${overdueCount} items exceed ${opts.ageDays}-day aging threshold`
          : '',
        score: overdueCount,
        metadata: { overdueCount, ageDays: opts.ageDays },
      };
    },
  };
}
