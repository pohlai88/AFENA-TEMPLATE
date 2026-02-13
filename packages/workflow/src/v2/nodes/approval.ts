import type { ApprovalNodeConfig, StepResult, WorkflowNodeConfig, WorkflowStepContext } from '../types';
import type { WorkflowNodeHandler } from './types';

/**
 * Approval node handler — creates an approval request (WF-03: version-pinned + consumptive).
 *
 * TX-safe: executes within the same DB transaction.
 * The engine creates the approval_request row with version-pinned snapshot,
 * then this step enters a 'pending' state waiting for the approval decision.
 */
export const approvalHandler: WorkflowNodeHandler = {
  nodeType: 'approval',
  async execute(ctx: WorkflowStepContext, config: WorkflowNodeConfig): Promise<StepResult> {
    const approvalConfig = config as ApprovalNodeConfig;

    if (approvalConfig.nodeType !== 'approval') {
      return {
        status: 'failed',
        error: `Expected approval config, got ${String((config as { nodeType?: string }).nodeType)}`,
      };
    }

    // Approval nodes are special — they don't complete immediately.
    // The engine:
    // 1. Creates an approval_request row (version-pinned, WF-03)
    // 2. Stores snapshot_version_id on the step execution
    // 3. Sets step status to 'pending' (waiting for external decision)
    // 4. When the decision arrives, the engine resumes this step
    //
    // For MVP, we return 'completed' with the approval metadata.
    // The engine layer handles the actual approval lifecycle.
    return {
      status: 'completed',
      output: {
        approvalType: approvalConfig.approvalType,
        chainId: approvalConfig.chainId ?? null,
        resolverStrategy: approvalConfig.resolverStrategy ?? 'direct_user',
        entityVersion: ctx.entityVersion,
        instanceId: ctx.instanceId,
      },
    };
  },
};
