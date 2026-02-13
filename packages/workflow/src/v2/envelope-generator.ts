import type { BodySlot, WorkflowEdge, WorkflowNode } from './types';
import type { DocStatus, EntityContract } from 'afena-canon';

/**
 * Generated envelope — the immutable system skeleton for a workflow.
 * Produced from EntityContract.lifecycleTransitions.
 */
export interface GeneratedEnvelope {
  entityType: string;
  version: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  slots: BodySlot[];
}

/**
 * Generate a system envelope from an EntityContract.
 *
 * Maps Canon lifecycle transitions to a DAG with:
 * - sys:start, sys:end
 * - sys:state:<status> for each reachable status
 * - sys:gate:<verb> for each transition verb
 * - Edges connecting states through gates
 * - Body slots between consecutive state/gate pairs
 *
 * The envelope is deterministic: same contract → same envelope.
 */
export function generateEnvelope(contract: EntityContract, version: number = 1): GeneratedEnvelope {
  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];
  const slots: BodySlot[] = [];

  const nodeSet = new Set<string>();
  const edgeSet = new Set<string>();

  function ensureNode(id: string, type: WorkflowNode['type'], editWindow?: WorkflowNode['editWindow'], config?: WorkflowNode['config']): void {
    if (nodeSet.has(id)) return;
    nodeSet.add(id);
    nodes.push({ id, type, label: id, ...(editWindow ? { editWindow } : {}), ...(config ? { config } : {}) });
  }

  function ensureEdge(id: string, sourceNodeId: string, targetNodeId: string, label?: string, priority?: number): void {
    if (edgeSet.has(id)) return;
    edgeSet.add(id);
    edges.push({ id, sourceNodeId, targetNodeId, ...(label ? { label } : {}), priority: priority ?? 0 });
  }

  // Always create start and end nodes
  ensureNode('sys:start', 'start', 'editable');
  ensureNode('sys:end', 'end', 'locked');

  if (!contract.hasLifecycle || contract.transitions.length === 0) {
    // No lifecycle — simple start → end
    ensureEdge('sys:edge:start_to_end', 'sys:start', 'sys:end');
    return { entityType: contract.entityType, version, nodes, edges, slots };
  }

  // Collect all statuses referenced in transitions
  const allStatuses = new Set<string>();
  for (const t of contract.transitions) {
    allStatuses.add(t.from);
    for (const action of t.allowed) {
      // Each allowed action implies a target status
      const target = resolveTargetStatus(t.from, action);
      if (target) allStatuses.add(target);
    }
  }

  // Create state nodes for each status
  for (const status of allStatuses) {
    const editWindow = resolveEditWindow(status);
    ensureNode(`sys:state:${status}`, 'lifecycle_gate', editWindow, {
      nodeType: 'lifecycle_gate',
      fromStatus: status as DocStatus,
      toStatus: status as DocStatus,
      verb: 'enter',
    });
  }

  // Connect start → first state (draft)
  if (allStatuses.has('draft')) {
    ensureEdge('sys:edge:start_to_draft', 'sys:start', 'sys:state:draft');
  }

  // Create gate nodes and edges for each transition
  let edgePriority = 0;
  for (const t of contract.transitions) {
    for (const action of t.allowed) {
      const target = resolveTargetStatus(t.from, action);
      if (!target) continue;

      const gateId = `sys:gate:${action}`;
      const gateEditWindow = resolveEditWindow(target);

      ensureNode(gateId, 'lifecycle_gate', gateEditWindow, {
        nodeType: 'lifecycle_gate',
        fromStatus: t.from,
        toStatus: target,
        verb: action,
      });

      // state → gate
      const stateToGateEdgeId = `sys:edge:${t.from}_to_${action}`;
      ensureEdge(stateToGateEdgeId, `sys:state:${t.from}`, gateId, action, edgePriority++);

      // gate → target state
      const gateToStateEdgeId = `sys:edge:${action}_to_${target}`;
      ensureEdge(gateToStateEdgeId, gateId, `sys:state:${target}`, undefined, edgePriority++);
    }
  }

  // Connect terminal states to end
  const terminalStatuses = ['active', 'cancelled', 'amended'];
  for (const status of terminalStatuses) {
    if (allStatuses.has(status)) {
      ensureEdge(`sys:edge:${status}_to_end`, `sys:state:${status}`, 'sys:end');
    }
  }

  // Generate body slots between consecutive state/gate pairs
  // Standard slots for common lifecycle patterns
  if (allStatuses.has('draft') && nodeSet.has('sys:gate:submit')) {
    slots.push({
      slotId: 'slot:draft_to_submit',
      entryNodeId: 'sys:state:draft',
      exitNodeId: 'sys:gate:submit',
      defaultEditWindow: 'editable',
      stableRegion: false,
    });
  }

  if (allStatuses.has('submitted') && nodeSet.has('sys:gate:approve')) {
    slots.push({
      slotId: 'slot:submitted_to_approved',
      entryNodeId: 'sys:state:submitted',
      exitNodeId: 'sys:gate:approve',
      defaultEditWindow: 'amend_only',
      stableRegion: true,
    });
  }

  if (nodeSet.has('sys:gate:approve') && allStatuses.has('active')) {
    slots.push({
      slotId: 'slot:approved_to_active',
      entryNodeId: 'sys:gate:approve',
      exitNodeId: 'sys:state:active',
      defaultEditWindow: 'locked',
      stableRegion: false,
    });
  }

  if (allStatuses.has('amended') && nodeSet.has('sys:gate:submit')) {
    slots.push({
      slotId: 'slot:amendment_cycle',
      entryNodeId: 'sys:state:amended',
      exitNodeId: 'sys:gate:submit',
      defaultEditWindow: 'editable',
      stableRegion: false,
    });
  }

  return { entityType: contract.entityType, version, nodes, edges, slots };
}

/**
 * Resolve target status from a source status + action verb.
 * Maps Canon ActionKind verbs to their resulting DocStatus.
 */
function resolveTargetStatus(from: string, action: string): DocStatus | null {
  const transitionMap: Record<string, Record<string, string>> = {
    draft: {
      submit: 'submitted',
      cancel: 'cancelled',
      delete: 'cancelled',
    },
    submitted: {
      approve: 'active',
      reject: 'draft',
      cancel: 'cancelled',
    },
    active: {
      cancel: 'cancelled',
    },
    amended: {
      submit: 'submitted',
      cancel: 'cancelled',
    },
  };

  return (transitionMap[from]?.[action] as DocStatus) ?? null;
}

/**
 * Resolve edit window for a given status.
 */
function resolveEditWindow(status: string): 'editable' | 'locked' | 'amend_only' {
  switch (status) {
    case 'draft':
      return 'editable';
    case 'submitted':
      return 'amend_only';
    case 'active':
      return 'locked';
    case 'cancelled':
      return 'locked';
    case 'amended':
      return 'editable';
    default:
      return 'locked';
  }
}
