/**
 * Types for the visual workflow slot builder (Phase 4).
 * Maps workflow V2 types to React Flow node/edge structures.
 */

import type { Node, Edge } from '@xyflow/react';

// ── Node type metadata for palette + rendering ──────────────

export const SYSTEM_NODE_TYPES = ['start', 'end', 'lifecycle_gate', 'policy_gate'] as const;

export const USER_NODE_TYPES = [
  'action',
  'approval',
  'condition',
  'parallel_split',
  'parallel_join',
  'wait_timer',
  'wait_event',
  'webhook_out',
  'notification',
  'script',
  'rule',
] as const;

export type SystemNodeType = (typeof SYSTEM_NODE_TYPES)[number];
export type UserNodeType = (typeof USER_NODE_TYPES)[number];

export interface NodeTypeMetadata {
  type: string;
  label: string;
  description: string;
  category: 'system' | 'flow' | 'integration' | 'approval';
  color: string;
  icon: string;
  isSystem: boolean;
}

export const NODE_TYPE_CATALOG: Record<string, NodeTypeMetadata> = {
  start: {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    category: 'system',
    color: '#22c55e',
    icon: 'Play',
    isSystem: true,
  },
  end: {
    type: 'end',
    label: 'End',
    description: 'Workflow terminal state',
    category: 'system',
    color: '#ef4444',
    icon: 'Square',
    isSystem: true,
  },
  lifecycle_gate: {
    type: 'lifecycle_gate',
    label: 'Lifecycle Gate',
    description: 'Enforces state transition',
    category: 'system',
    color: '#8b5cf6',
    icon: 'Shield',
    isSystem: true,
  },
  policy_gate: {
    type: 'policy_gate',
    label: 'Policy Gate',
    description: 'Enforces mutate() policy check',
    category: 'system',
    color: '#8b5cf6',
    icon: 'ShieldCheck',
    isSystem: true,
  },
  action: {
    type: 'action',
    label: 'Action',
    description: 'Calls mutate() with predefined spec',
    category: 'flow',
    color: '#3b82f6',
    icon: 'Zap',
    isSystem: false,
  },
  approval: {
    type: 'approval',
    label: 'Approval',
    description: 'Creates approval request (version-pinned)',
    category: 'approval',
    color: '#f59e0b',
    icon: 'UserCheck',
    isSystem: false,
  },
  condition: {
    type: 'condition',
    label: 'Condition',
    description: 'Evaluates DSL expression, branches',
    category: 'flow',
    color: '#06b6d4',
    icon: 'GitBranch',
    isSystem: false,
  },
  parallel_split: {
    type: 'parallel_split',
    label: 'Parallel Split',
    description: 'Fork into parallel paths',
    category: 'flow',
    color: '#a855f7',
    icon: 'Split',
    isSystem: false,
  },
  parallel_join: {
    type: 'parallel_join',
    label: 'Parallel Join',
    description: 'Wait for parallel tokens (ALL/ANY)',
    category: 'flow',
    color: '#a855f7',
    icon: 'Merge',
    isSystem: false,
  },
  wait_timer: {
    type: 'wait_timer',
    label: 'Wait Timer',
    description: 'Pause for duration or until datetime',
    category: 'flow',
    color: '#64748b',
    icon: 'Clock',
    isSystem: false,
  },
  wait_event: {
    type: 'wait_event',
    label: 'Wait Event',
    description: 'Pause until external event arrives',
    category: 'flow',
    color: '#64748b',
    icon: 'Radio',
    isSystem: false,
  },
  webhook_out: {
    type: 'webhook_out',
    label: 'Webhook',
    description: 'Fire HTTP POST to external system',
    category: 'integration',
    color: '#10b981',
    icon: 'Globe',
    isSystem: false,
  },
  notification: {
    type: 'notification',
    label: 'Notification',
    description: 'Send email/SMS/in-app notification',
    category: 'integration',
    color: '#10b981',
    icon: 'Bell',
    isSystem: false,
  },
  script: {
    type: 'script',
    label: 'Script',
    description: 'Execute typed DSL expression',
    category: 'flow',
    color: '#3b82f6',
    icon: 'Code',
    isSystem: false,
  },
  rule: {
    type: 'rule',
    label: 'Rule (V1)',
    description: 'Evaluate existing V1 workflow rule',
    category: 'flow',
    color: '#6b7280',
    icon: 'FileCode',
    isSystem: false,
  },
};

// ── React Flow node data ────────────────────────────────────

export interface FlowNodeData extends Record<string, unknown> {
  nodeType: string;
  label: string;
  editWindow?: string;
  config?: Record<string, unknown>;
  isSystem: boolean;
  slotId?: string;
  provenance?: string;
}

export type FlowNode = Node<FlowNodeData>;

export interface FlowEdgeData extends Record<string, unknown> {
  label?: string;
  condition?: Record<string, unknown>;
  priority?: number;
  provenance?: string;
}

export type FlowEdge = Edge<FlowEdgeData>;

// ── Slot info for the slot selector ─────────────────────────

export interface SlotInfo {
  slotId: string;
  entryNodeId: string;
  exitNodeId: string;
  defaultEditWindow: string;
  stableRegion: boolean;
  nodeCount: number;
  edgeCount: number;
}
