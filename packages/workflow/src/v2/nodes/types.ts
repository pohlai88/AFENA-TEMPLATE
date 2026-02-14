import type { StepResult, WorkflowNodeConfig, WorkflowNodeType, WorkflowStepContext } from '../types';

/**
 * WorkflowNodeHandler — interface for all node type implementations.
 *
 * Handler Atomicity Rule (PRD § Handler Atomicity):
 * - TX-safe handlers (action, lifecycle_gate, policy_gate, approval, condition, rule, start, end):
 *   Must execute within the same DB transaction. If they fail, the TX rolls back entirely.
 * - Enqueue-only handlers (webhook_out, notification):
 *   Must NOT do direct HTTP/SMTP in the TX. They write to workflow_side_effects_outbox
 *   and return immediately. The IO worker processes them asynchronously.
 */
export interface WorkflowNodeHandler {
  readonly nodeType: WorkflowNodeType;
  execute(ctx: WorkflowStepContext, config: WorkflowNodeConfig): Promise<StepResult>;
}

/**
 * Node handler registry — maps node types to their handler implementations.
 */
export type NodeHandlerRegistry = Map<WorkflowNodeType, WorkflowNodeHandler>;
