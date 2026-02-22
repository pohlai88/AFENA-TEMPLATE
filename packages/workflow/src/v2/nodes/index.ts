import { actionHandler } from './action';
import { approvalHandler } from './approval';
import { conditionHandler } from './condition';
import { endHandler } from './end';
import { lifecycleGateHandler } from './lifecycle-gate';
import { notificationHandler } from './notification';
import { parallelJoinHandler, parallelSplitHandler } from './parallel';
import { policyGateHandler } from './policy-gate';
import { ruleHandler } from './rule';
import { scriptHandler } from './script';
import { startHandler } from './start';
import { waitEventHandler, waitTimerHandler } from './wait';
import { webhookOutHandler } from './webhook';

import type { WorkflowNodeType } from '../types';
import type { NodeHandlerRegistry, WorkflowNodeHandler } from './types';

export type { WorkflowNodeHandler, NodeHandlerRegistry } from './types';

export {
  startHandler,
  endHandler,
  lifecycleGateHandler,
  policyGateHandler,
  actionHandler,
  approvalHandler,
  conditionHandler,
  parallelSplitHandler,
  parallelJoinHandler,
  waitTimerHandler,
  waitEventHandler,
  webhookOutHandler,
  notificationHandler,
  scriptHandler,
  ruleHandler,
};

/**
 * Create the node handler registry with all registered handlers.
 *
 * Phase 1: start, end, lifecycle_gate, policy_gate, action, approval, condition, rule
 * Phase 2: parallel_split, parallel_join, wait_timer, wait_event
 * Phase 3: webhook_out, notification
 * Gap closure: script (was missing)
 */
export function createHandlerRegistry(): NodeHandlerRegistry {
  const registry: NodeHandlerRegistry = new Map<WorkflowNodeType, WorkflowNodeHandler>();

  const handlers: WorkflowNodeHandler[] = [
    startHandler,
    endHandler,
    lifecycleGateHandler,
    policyGateHandler,
    actionHandler,
    approvalHandler,
    conditionHandler,
    parallelSplitHandler,
    parallelJoinHandler,
    waitTimerHandler,
    waitEventHandler,
    webhookOutHandler,
    notificationHandler,
    scriptHandler,
    ruleHandler,
  ];

  for (const handler of handlers) {
    registry.set(handler.nodeType, handler);
  }

  return registry;
}
