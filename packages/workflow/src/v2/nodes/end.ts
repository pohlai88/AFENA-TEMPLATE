import type { StepResult, WorkflowNodeConfig, WorkflowStepContext } from '../types';
import type { WorkflowNodeHandler } from './types';

export const endHandler: WorkflowNodeHandler = {
  nodeType: 'end',
  async execute(_ctx: WorkflowStepContext, _config: WorkflowNodeConfig): Promise<StepResult> {
    // End node completes the workflow — the engine marks the instance as completed
    return { status: 'completed' };
  },
};
