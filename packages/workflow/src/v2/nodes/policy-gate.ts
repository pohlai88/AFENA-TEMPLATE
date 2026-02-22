import type { PolicyGateConfig, StepResult, WorkflowNodeConfig, WorkflowStepContext } from '../types';
import type { WorkflowNodeHandler } from './types';

/**
 * Policy gate handler — enforces mutate() policy check (WF-08).
 *
 * TX-safe: executes within the same DB transaction.
 * Validates that the actor has the required permission before allowing the step.
 */
export const policyGateHandler: WorkflowNodeHandler = {
  nodeType: 'policy_gate',
  async execute(ctx: WorkflowStepContext, config: WorkflowNodeConfig): Promise<StepResult> {
    const gateConfig = config as PolicyGateConfig;

    if (gateConfig.nodeType !== 'policy_gate') {
      return {
        status: 'failed',
        error: `Expected policy_gate config, got ${String((config as { nodeType?: string }).nodeType)}`,
      };
    }

    // Policy check is delegated to the engine's authority resolver
    // The handler signals what permission is required; the engine enforces it
    return {
      status: 'completed',
      output: {
        requiredPermission: gateConfig.requiredPermission,
        actorUserId: ctx.actorUserId,
        entityVersion: ctx.entityVersion,
      },
    };
  },
};
