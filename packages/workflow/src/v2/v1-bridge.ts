import type { StepResult, WorkflowStepContext } from './types';

/**
 * V1 Bridge — wraps the existing V1 evaluateRules() for use in V2 rule nodes.
 *
 * The bridge translates between V2 WorkflowStepContext and V1 RuleContext,
 * calls the V1 engine's evaluateRules(), and maps the result back to V2 StepResult.
 *
 * This is a thin adapter — the actual V1 engine code is unchanged.
 */

/**
 * V1 Rule evaluation function signature.
 * This matches the existing evaluateRules() export from the V1 engine.
 */
export type V1EvaluateRulesFn = (params: {
  entityType: string;
  entityId: string;
  actionType: string;
  timing: 'before' | 'after';
  context: Record<string, unknown>;
}) => Promise<{
  passed: boolean;
  results: Array<{
    ruleId: string;
    passed: boolean;
    message?: string;
  }>;
}>;

/**
 * Execute V1 rules within a V2 workflow step.
 *
 * @param ctx - V2 workflow step context
 * @param ruleIds - Optional filter: only evaluate these rule IDs
 * @param timing - 'before' or 'after' the action
 * @param evaluateRules - The V1 evaluateRules function (injected for testability)
 */
export async function executeV1Rules(
  ctx: WorkflowStepContext,
  ruleIds: string[],
  timing: 'before' | 'after',
  evaluateRules: V1EvaluateRulesFn,
): Promise<StepResult> {
  try {
    const v1Result = await evaluateRules({
      entityType: ctx.entityType,
      entityId: ctx.entityId,
      actionType: `${ctx.entityType}.${timing === 'before' ? 'validate' : 'post_process'}`,
      timing,
      context: {
        ...ctx.contextJson,
        entityVersion: ctx.entityVersion,
        actorUserId: ctx.actorUserId,
        instanceId: ctx.instanceId,
        nodeId: ctx.nodeId,
        tokenId: ctx.tokenId,
        ruleIds,
      },
    });

    if (v1Result.passed) {
      return {
        status: 'completed',
        output: {
          v1Bridge: true,
          timing,
          ruleCount: v1Result.results.length,
          results: v1Result.results,
        },
      };
    }

    // Rules failed — report which ones
    const failedRules = v1Result.results.filter((r) => !r.passed);
    return {
      status: 'failed',
      error: `V1 rules failed: ${failedRules.map((r) => r.ruleId).join(', ')}`,
      output: {
        v1Bridge: true,
        timing,
        ruleCount: v1Result.results.length,
        failedRules,
      },
    };
  } catch (err) {
    return {
      status: 'failed',
      error: `V1 bridge error: ${err instanceof Error ? err.message : String(err)}`,
      output: { v1Bridge: true, timing },
    };
  }
}
