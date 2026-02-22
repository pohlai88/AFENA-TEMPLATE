import type { ActionNodeConfig, StepResult, WorkflowNodeConfig, WorkflowStepContext } from '../types';
import type { WorkflowNodeHandler } from './types';

/**
 * Action node handler — calls mutate() with a predefined MutationSpecRef.
 *
 * TX-safe: executes within the same DB transaction.
 * The engine resolves the payloadTemplate DSL expressions and calls mutate().
 */
export const actionHandler: WorkflowNodeHandler = {
  nodeType: 'action',
  async execute(ctx: WorkflowStepContext, config: WorkflowNodeConfig): Promise<StepResult> {
    const actionConfig = config as ActionNodeConfig;

    if (actionConfig.nodeType !== 'action') {
      return {
        status: 'failed',
        error: `Expected action config, got ${String((config as { nodeType?: string }).nodeType)}`,
      };
    }

    // The engine is responsible for:
    // 1. Evaluating DSL expressions in payloadTemplate against ctx
    // 2. Calling mutate() with the resolved MutationSpec
    // 3. Recording the result
    //
    // This handler returns the spec for the engine to execute.
    // Direct mutate() call happens in the engine layer, not here,
    // because the engine owns the DB transaction (K-02).
    return {
      status: 'completed',
      output: {
        actionType: actionConfig.mutationSpec.actionType,
        runAs: actionConfig.mutationSpec.runAs,
        entityVersion: ctx.entityVersion,
      },
    };
  },
};
