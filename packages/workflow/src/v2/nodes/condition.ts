import type { ConditionNodeConfig, StepResult, WorkflowNodeConfig, WorkflowStepContext } from '../types';
import type { WorkflowNodeHandler } from './types';

/**
 * Condition node handler — evaluates a typed DSL expression and branches.
 *
 * TX-safe: executes within the same DB transaction.
 * The engine evaluates the DSL expression and selects the matching outgoing edge.
 */
export const conditionHandler: WorkflowNodeHandler = {
  nodeType: 'condition',
  async execute(ctx: WorkflowStepContext, config: WorkflowNodeConfig): Promise<StepResult> {
    const condConfig = config as ConditionNodeConfig;

    if (condConfig.nodeType !== 'condition') {
      return {
        status: 'failed',
        error: `Expected condition config, got ${String((config as { nodeType?: string }).nodeType)}`,
      };
    }

    // The engine evaluates the DSL expression against the workflow context.
    // Based on the result, it selects the matching outgoing edge(s).
    // For MVP, the engine handles DSL evaluation (Step 9).
    // This handler returns the expression metadata for the engine to evaluate.
    return {
      status: 'completed',
      output: {
        expression: condConfig.expression.expr,
        returnType: condConfig.expression.returnType ?? 'boolean',
        entityVersion: ctx.entityVersion,
      },
    };
  },
};
