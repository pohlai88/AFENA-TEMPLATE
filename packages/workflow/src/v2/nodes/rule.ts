import type { RuleConfig, StepResult, WorkflowNodeConfig, WorkflowStepContext } from '../types';
import type { WorkflowNodeHandler } from './types';

/**
 * Rule node handler — V1 bridge: evaluates existing WorkflowRule (Step 16).
 *
 * TX-safe: executes within the same DB transaction.
 * Wraps the V1 evaluateRules() function to provide backward compatibility.
 */
export const ruleHandler: WorkflowNodeHandler = {
  nodeType: 'rule',
  async execute(ctx: WorkflowStepContext, config: WorkflowNodeConfig): Promise<StepResult> {
    const ruleConfig = config as RuleConfig;

    if (ruleConfig.nodeType !== 'rule') {
      return {
        status: 'failed',
        error: `Expected rule config, got ${String((config as { nodeType?: string }).nodeType)}`,
      };
    }

    // The engine delegates to the V1 evaluateRules() function.
    // This handler returns the rule metadata for the engine to execute.
    // Full V1 bridge integration is Phase 1 Step 16.
    return {
      status: 'completed',
      output: {
        ruleIds: ruleConfig.ruleIds ?? [],
        timing: ruleConfig.timing,
        entityType: ctx.entityType,
        entityVersion: ctx.entityVersion,
      },
    };
  },
};
