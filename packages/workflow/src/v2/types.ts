import type { DocStatus } from 'afena-canon';

// ── Node Types ──────────────────────────────────────────────

export const WORKFLOW_NODE_TYPES = [
  // System (lifecycle-derived, immutable)
  'start',
  'end',
  'lifecycle_gate',
  'policy_gate',
  // User-customizable
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

export type WorkflowNodeType = (typeof WORKFLOW_NODE_TYPES)[number];

// ── Definition Status ───────────────────────────────────────

export const DEFINITION_STATUSES = ['draft', 'published', 'archived'] as const;
export type DefinitionStatus = (typeof DEFINITION_STATUSES)[number];

// ── Definition Kind ─────────────────────────────────────────

export const DEFINITION_KINDS = ['envelope', 'org_patch', 'effective'] as const;
export type DefinitionKind = (typeof DEFINITION_KINDS)[number];

// ── Instance Status ─────────────────────────────────────────

export const INSTANCE_STATUSES = ['running', 'paused', 'completed', 'failed', 'cancelled'] as const;
export type InstanceStatus = (typeof INSTANCE_STATUSES)[number];

// ── Step Status ─────────────────────────────────────────────

export const STEP_STATUSES = ['pending', 'running', 'completed', 'failed', 'skipped', 'cancelled'] as const;
export type StepStatus = (typeof STEP_STATUSES)[number];

// ── Outbox Status ───────────────────────────────────────────

export const OUTBOX_STATUSES = ['pending', 'processing', 'completed', 'failed', 'dead_letter'] as const;
export type OutboxStatus = (typeof OUTBOX_STATUSES)[number];

// ── Edit Window ─────────────────────────────────────────────

export const EDIT_WINDOWS = ['editable', 'locked', 'amend_only'] as const;
export type EditWindow = (typeof EDIT_WINDOWS)[number];

// ── Run-As ──────────────────────────────────────────────────

export const RUN_AS_MODES = ['actor', 'system', 'service_account'] as const;
export type RunAsMode = (typeof RUN_AS_MODES)[number];

// ── Trigger Types ───────────────────────────────────────────

export const TRIGGER_TYPES = [
  'on_create',
  'on_lifecycle_transition',
  'on_mutation',
  'on_timer',
  'on_event',
  'manual',
] as const;
export type TriggerType = (typeof TRIGGER_TYPES)[number];

// ── Side-Effect Types ───────────────────────────────────────

export const SIDE_EFFECT_TYPES = ['webhook', 'email', 'sms', 'integration'] as const;
export type SideEffectType = (typeof SIDE_EFFECT_TYPES)[number];

// ── Slot Attachment Modes ───────────────────────────────────

export const ENTRY_EDGE_MODES = ['serial', 'branch'] as const;
export type EntryEdgeMode = (typeof ENTRY_EDGE_MODES)[number];

export const EXIT_EDGE_MODES = ['single', 'join'] as const;
export type ExitEdgeMode = (typeof EXIT_EDGE_MODES)[number];

// ── Join Modes ──────────────────────────────────────────────

export const JOIN_MODES = ['all', 'any'] as const;
export type JoinMode = (typeof JOIN_MODES)[number];

// ── DSL Expression ──────────────────────────────────────────

export interface DslExpression {
  expr: string;
  returnType?: 'string' | 'number' | 'boolean' | 'any';
}

// ── Condition JSON (reuses existing interpreter format) ─────

export interface ConditionJson {
  type: string;
  params?: Record<string, unknown>;
}

// ── Workflow Node ───────────────────────────────────────────

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label?: string;
  editWindow?: EditWindow;
  config?: WorkflowNodeConfig;
}

export type WorkflowNodeConfig =
  | ActionNodeConfig
  | ApprovalNodeConfig
  | ConditionNodeConfig
  | LifecycleGateConfig
  | PolicyGateConfig
  | ParallelSplitConfig
  | ParallelJoinConfig
  | WaitTimerConfig
  | WaitEventConfig
  | WebhookOutConfig
  | NotificationConfig
  | ScriptConfig
  | RuleConfig
  | Record<string, never>;

export interface MutationSpecRef {
  actionType: string;
  payloadTemplate: Record<string, DslExpression>;
  runAs: RunAsMode;
}

export interface ActionNodeConfig {
  nodeType: 'action';
  mutationSpec: MutationSpecRef;
}

export interface ApprovalNodeConfig {
  nodeType: 'approval';
  approvalType: 'inline' | 'chain';
  chainId?: string;
  resolverStrategy?: 'direct_user' | 'role_based' | 'rule_based';
  resolverConfig?: Record<string, unknown>;
}

export interface ConditionNodeConfig {
  nodeType: 'condition';
  expression: DslExpression;
}

export interface LifecycleGateConfig {
  nodeType: 'lifecycle_gate';
  fromStatus: DocStatus;
  toStatus: DocStatus;
  verb: string;
}

export interface PolicyGateConfig {
  nodeType: 'policy_gate';
  requiredPermission: string;
}

export interface ParallelSplitConfig {
  nodeType: 'parallel_split';
  branchCount: number;
}

export interface ParallelJoinConfig {
  nodeType: 'parallel_join';
  mode: JoinMode;
  requiredTokenCount: number;
}

export interface WaitTimerConfig {
  nodeType: 'wait_timer';
  durationMs?: number;
  resumeAt?: DslExpression;
}

export interface WaitEventConfig {
  nodeType: 'wait_event';
  eventKeyTemplate: DslExpression;
}

export interface WebhookOutConfig {
  nodeType: 'webhook_out';
  url: DslExpression;
  method: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, DslExpression>;
  bodyTemplate: Record<string, DslExpression>;
}

export interface NotificationConfig {
  nodeType: 'notification';
  channel: 'email' | 'sms' | 'in_app';
  recipientTemplate: DslExpression;
  subjectTemplate?: DslExpression;
  bodyTemplate: DslExpression;
}

export interface ScriptConfig {
  nodeType: 'script';
  expression: DslExpression;
}

export interface RuleConfig {
  nodeType: 'rule';
  ruleIds?: string[];
  timing: 'before' | 'after';
}

// ── Workflow Edge ───────────────────────────────────────────

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  condition?: ConditionJson;
  priority?: number;
}

// ── Body Slot ───────────────────────────────────────────────

export interface BodySlot {
  slotId: string;
  entryNodeId: string;
  exitNodeId: string;
  defaultEditWindow: EditWindow;
  stableRegion: boolean;
}

// ── Slot Graph Patch ────────────────────────────────────────

export interface SlotGraphPatch {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  entryEdgeMode: EntryEdgeMode;
  exitEdgeMode: ExitEdgeMode;
  editWindowOverride?: EditWindow;
}

// ── Org Workflow Definition ─────────────────────────────────

export interface OrgWorkflowDefinition {
  baseRef: {
    entityType: string;
    envelopeVersion: number;
  };
  slots: Record<string, SlotGraphPatch>;
}

// ── Compiled Effective Workflow ─────────────────────────────

export interface CompiledEdge {
  id: string;
  source: string;
  target: string;
  priority: number;
  condition?: ConditionJson;
  label?: string;
  provenance: string; // 'envelope' or slotId
}

export interface JoinRequirement {
  requiredTokenCount: number;
  mode: JoinMode;
}

export interface SystemGateIntegrity {
  requiredGates: string[];
  presentGates: string[];
  valid: boolean;
}

export interface CompiledWorkflow {
  adjacency: Record<string, string[]>;
  reverseAdjacency: Record<string, string[]>;
  edgesById: Record<string, CompiledEdge>;
  topologicalOrder: string[];
  joinRequirements: Record<string, JoinRequirement>;
  editWindows: Record<string, EditWindow>;
  stableRegionNodes: string[];
  slotMap: Record<string, string>;
  systemGateIntegrity: SystemGateIntegrity;
  envelopeVersion: number;
  compilerVersion: string;
  hash: string;
}

// ── Workflow Token ──────────────────────────────────────────

export interface WorkflowToken {
  id: string;
  currentNodeId: string;
  status: 'active' | 'waiting' | 'completed' | 'cancelled';
  parentTokenId?: string;
  spawnedFromNodeId?: string;
  pathIndex?: number;
  createdAt: string;
}

// ── Step Result ─────────────────────────────────────────────

export interface StepResult {
  status: 'completed' | 'failed' | 'skipped';
  output?: Record<string, unknown>;
  error?: string;
  chosenEdgeIds?: string[];
  sideEffects?: SideEffectRequest[];
}

export interface SideEffectRequest {
  effectType: SideEffectType;
  payload: Record<string, unknown>;
}

// ── Node Handler Interface ──────────────────────────────────

export interface WorkflowStepContext {
  instanceId: string;
  nodeId: string;
  tokenId: string;
  entityType: string;
  entityId: string;
  entityVersion: number;
  actorUserId: string;
  runAs: RunAsMode;
  actor: { userId: string; orgId: string };
  orgId: string;
  traceId?: string;
  compiled: CompiledWorkflow;
  contextJson: Record<string, unknown>;
  entitySnapshot?: Record<string, unknown>;
}

export interface WorkflowNodeHandler {
  nodeType: WorkflowNodeType;
  execute(ctx: WorkflowStepContext, config: WorkflowNodeConfig): Promise<StepResult>;
}

// ── Compiler Version ────────────────────────────────────────

export const COMPILER_VERSION = '1.0.0';
