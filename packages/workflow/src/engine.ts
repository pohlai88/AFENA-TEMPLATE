import { extractVerb } from 'afena-canon';

import { getRegisteredRules } from './registry';

import type {
  RuleContext,
  RuleEvaluationResult,
  RuleExecutionLog,
  RuleTiming,
} from './types';
import type { MutationSpec } from 'afena-canon';

/**
 * Evaluate all workflow rules for a given timing phase.
 *
 * - 'before' rules can block the mutation or enrich the input.
 *   If any before-rule blocks, the mutation is rejected.
 *   Enriched inputs are merged left-to-right by priority.
 *
 * - 'after' rules execute side effects. They cannot block.
 *   Errors in after-rules are logged but do not fail the mutation.
 */
export async function evaluateRules(
  timing: RuleTiming,
  spec: MutationSpec,
  entity: Record<string, unknown> | null,
  ctx: RuleContext,
): Promise<RuleEvaluationResult> {
  const verb = extractVerb(spec.actionType);
  const entityType = spec.entityRef.type;

  const applicableRules = getRegisteredRules().filter((rule) => {
    if (!rule.enabled) return false;
    if (rule.timing !== timing) return false;
    if (rule.entityTypes.length > 0 && !rule.entityTypes.includes(entityType)) return false;
    if (rule.verbs.length > 0 && !rule.verbs.includes(verb)) return false;
    return true;
  });

  const log: RuleExecutionLog[] = [];
  let enrichedInput: Record<string, unknown> | undefined;
  let blocked = false;
  let blockReason: string | undefined;

  for (const rule of applicableRules) {
    const start = performance.now();
    const entry: RuleExecutionLog = {
      ruleId: rule.id,
      ruleName: rule.name,
      timing,
      conditionMatched: false,
      durationMs: 0,
    };

    try {
      // Evaluate condition
      const condResult = await rule.condition(spec, entity, ctx);
      entry.conditionMatched = condResult.match;

      if (!condResult.match) {
        entry.durationMs = performance.now() - start;
        log.push(entry);
        continue;
      }

      // Execute action
      const actionResult = await rule.action(spec, entity, ctx);
      entry.actionResult = actionResult;

      if (timing === 'before') {
        if (!actionResult.ok) {
          blocked = true;
          blockReason = actionResult.message ?? `Blocked by rule '${rule.name}'`;
          entry.durationMs = performance.now() - start;
          log.push(entry);
          break;
        }

        // Merge enriched input
        if (actionResult.enrichedInput) {
          enrichedInput = { ...enrichedInput, ...actionResult.enrichedInput };
        }
      }
    } catch (e) {
      entry.error = e instanceof Error ? e.message : 'Unknown error';

      // Before-rule errors block the mutation (fail-safe)
      if (timing === 'before') {
        blocked = true;
        blockReason = `Rule '${rule.name}' threw: ${entry.error}`;
        entry.durationMs = performance.now() - start;
        log.push(entry);
        break;
      }
      // After-rule errors are logged but don't block
    }

    entry.durationMs = performance.now() - start;
    log.push(entry);
  }

  return {
    proceed: !blocked,
    blockReason,
    enrichedInput,
    log,
  };
}
