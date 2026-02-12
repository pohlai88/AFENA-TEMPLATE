import { and, db, eq, workflowRules } from 'afena-database';

import { interpretAction, interpretCondition } from './interpreter';
import { registerRule, unregisterByPrefix } from './registry';

import type { WorkflowRule } from './types';

const TTL_MS = 60_000;
const cache = new Map<string, { loadedAt: number; ruleIds: string[] }>();

/**
 * Load enabled workflow rules for an org from DB, interpret JSON into
 * ConditionFn/ActionFn, and register them in the in-memory registry.
 * TTL-cached (60s) to avoid repeated DB hits per request.
 *
 * Rule IDs are prefixed with `db:{orgId}:` for collision avoidance
 * and clean unregistration via unregisterByPrefix.
 *
 * If orgId is empty, returns immediately (no rules loaded, no cache pollution).
 */
export async function loadAndRegisterOrgRules(orgId: string): Promise<void> {
  if (!orgId) return;

  const now = Date.now();
  const hit = cache.get(orgId);
  if (hit && now - hit.loadedAt < TTL_MS) return;

  const prefix = `db:${orgId}:`;
  unregisterByPrefix(prefix);

  const rows = await db
    .select()
    .from(workflowRules)
    .where(and(eq(workflowRules.orgId, orgId), eq(workflowRules.enabled, true)))
    .orderBy(workflowRules.priority);

  const ruleIds: string[] = [];
  for (const r of rows) {
    const rule: WorkflowRule = {
      id: `db:${orgId}:${r.id}`,
      name: r.name,
      description: r.description ?? undefined,
      timing: r.timing as 'before' | 'after',
      entityTypes: r.entityTypes ?? [],
      verbs: r.verbs ?? [],
      priority: r.priority,
      enabled: true,
      condition: interpretCondition(r.conditionJson),
      action: interpretAction(r.actionJson),
    };
    registerRule(rule);
    ruleIds.push(rule.id);
  }

  cache.set(orgId, { loadedAt: now, ruleIds });
}
