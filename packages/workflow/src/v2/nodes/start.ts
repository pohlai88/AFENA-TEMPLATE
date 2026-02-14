import type { StepResult, WorkflowNodeConfig, WorkflowStepContext } from '../types';
import type { WorkflowNodeHandler } from './types';

export const startHandler: WorkflowNodeHandler = {
  nodeType: 'start',
  async execute(_ctx: WorkflowStepContext, _config: WorkflowNodeConfig): Promise<StepResult> {
    // Start node is a pass-through — it simply completes and advances to the next node
    return { status: 'completed' };
  },
};
