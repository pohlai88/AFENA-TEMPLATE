import type { WorkflowRule } from './types';

/**
 * In-memory rule registry.
 * Rules are registered at app startup and evaluated by the engine.
 * Future: rules can be loaded from DB for per-org customization.
 */
const rules: WorkflowRule[] = [];

/**
 * Register a workflow rule. Duplicate IDs are rejected.
 */
export function registerRule(rule: WorkflowRule): void {
  if (rules.some((r) => r.id === rule.id)) {
    throw new Error(`Workflow rule '${rule.id}' is already registered`);
  }
  rules.push(rule);
  rules.sort((a, b) => a.priority - b.priority);
}

/**
 * Remove a rule by ID. Returns true if found and removed.
 */
export function unregisterRule(ruleId: string): boolean {
  const idx = rules.findIndex((r) => r.id === ruleId);
  if (idx === -1) return false;
  rules.splice(idx, 1);
  return true;
}

/**
 * Get all registered rules (sorted by priority).
 */
export function getRegisteredRules(): readonly WorkflowRule[] {
  return rules;
}

/**
 * Clear all rules. Useful for testing.
 */
export function clearRules(): void {
  rules.length = 0;
}

/**
 * Remove all rules whose ID starts with the given prefix.
 * Used by the DB loader to clear stale org-scoped rules before reloading.
 */
export function unregisterByPrefix(prefix: string): number {
  const all = getRegisteredRules();
  const targets = all.filter((r) => r.id.startsWith(prefix));
  for (const r of targets) unregisterRule(r.id);
  return targets.length;
}
