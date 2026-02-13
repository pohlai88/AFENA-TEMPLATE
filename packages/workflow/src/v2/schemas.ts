import { z } from 'zod';

import {
  WORKFLOW_NODE_TYPES,
  DEFINITION_STATUSES,
  DEFINITION_KINDS,
  INSTANCE_STATUSES,
  STEP_STATUSES,
  OUTBOX_STATUSES,
  EDIT_WINDOWS,
  RUN_AS_MODES,
  TRIGGER_TYPES,
  SIDE_EFFECT_TYPES,
  ENTRY_EDGE_MODES,
  EXIT_EDGE_MODES,
  JOIN_MODES,
} from './types';

// ── Enums ───────────────────────────────────────────────────

export const workflowNodeTypeSchema = z.enum(WORKFLOW_NODE_TYPES);
export const definitionStatusSchema = z.enum(DEFINITION_STATUSES);
export const definitionKindSchema = z.enum(DEFINITION_KINDS);
export const instanceStatusSchema = z.enum(INSTANCE_STATUSES);
export const stepStatusSchema = z.enum(STEP_STATUSES);
export const outboxStatusSchema = z.enum(OUTBOX_STATUSES);
export const editWindowSchema = z.enum(EDIT_WINDOWS);
export const runAsModeSchema = z.enum(RUN_AS_MODES);
export const triggerTypeSchema = z.enum(TRIGGER_TYPES);
export const sideEffectTypeSchema = z.enum(SIDE_EFFECT_TYPES);
export const entryEdgeModeSchema = z.enum(ENTRY_EDGE_MODES);
export const exitEdgeModeSchema = z.enum(EXIT_EDGE_MODES);
export const joinModeSchema = z.enum(JOIN_MODES);

// ── DSL Expression ──────────────────────────────────────────

export const dslExpressionSchema = z.object({
  expr: z.string().min(1),
  returnType: z.enum(['string', 'number', 'boolean', 'any']).optional(),
});

// ── Condition JSON ──────────────────────────────────────────

export const conditionJsonSchema = z.object({
  type: z.string().min(1),
  params: z.record(z.string(), z.unknown()).optional(),
});

// ── Mutation Spec Ref ───────────────────────────────────────

export const mutationSpecRefSchema = z.object({
  actionType: z.string().min(1),
  payloadTemplate: z.record(z.string(), dslExpressionSchema),
  runAs: runAsModeSchema,
});

// ── Node Configs ────────────────────────────────────────────

export const actionNodeConfigSchema = z.object({
  nodeType: z.literal('action'),
  mutationSpec: mutationSpecRefSchema,
});

export const approvalNodeConfigSchema = z.object({
  nodeType: z.literal('approval'),
  approvalType: z.enum(['inline', 'chain']),
  chainId: z.string().optional(),
  resolverStrategy: z.enum(['direct_user', 'role_based', 'rule_based']).optional(),
  resolverConfig: z.record(z.string(), z.unknown()).optional(),
});

export const conditionNodeConfigSchema = z.object({
  nodeType: z.literal('condition'),
  expression: dslExpressionSchema,
});

export const lifecycleGateConfigSchema = z.object({
  nodeType: z.literal('lifecycle_gate'),
  fromStatus: z.string().min(1),
  toStatus: z.string().min(1),
  verb: z.string().min(1),
});

export const policyGateConfigSchema = z.object({
  nodeType: z.literal('policy_gate'),
  requiredPermission: z.string().min(1),
});

export const parallelSplitConfigSchema = z.object({
  nodeType: z.literal('parallel_split'),
  branchCount: z.number().int().min(2),
});

export const parallelJoinConfigSchema = z.object({
  nodeType: z.literal('parallel_join'),
  mode: joinModeSchema,
  requiredTokenCount: z.number().int().min(2),
});

export const waitTimerConfigSchema = z.object({
  nodeType: z.literal('wait_timer'),
  durationMs: z.number().int().positive().optional(),
  resumeAt: dslExpressionSchema.optional(),
});

export const waitEventConfigSchema = z.object({
  nodeType: z.literal('wait_event'),
  eventKeyTemplate: dslExpressionSchema,
});

export const webhookOutConfigSchema = z.object({
  nodeType: z.literal('webhook_out'),
  url: dslExpressionSchema,
  method: z.enum(['POST', 'PUT', 'PATCH']),
  headers: z.record(z.string(), dslExpressionSchema).optional(),
  bodyTemplate: z.record(z.string(), dslExpressionSchema),
});

export const notificationConfigSchema = z.object({
  nodeType: z.literal('notification'),
  channel: z.enum(['email', 'sms', 'in_app']),
  recipientTemplate: dslExpressionSchema,
  subjectTemplate: dslExpressionSchema.optional(),
  bodyTemplate: dslExpressionSchema,
});

export const scriptConfigSchema = z.object({
  nodeType: z.literal('script'),
  expression: dslExpressionSchema,
});

export const ruleConfigSchema = z.object({
  nodeType: z.literal('rule'),
  ruleIds: z.array(z.string()).optional(),
  timing: z.enum(['before', 'after']),
});

export const workflowNodeConfigSchema = z.discriminatedUnion('nodeType', [
  actionNodeConfigSchema,
  approvalNodeConfigSchema,
  conditionNodeConfigSchema,
  lifecycleGateConfigSchema,
  policyGateConfigSchema,
  parallelSplitConfigSchema,
  parallelJoinConfigSchema,
  waitTimerConfigSchema,
  waitEventConfigSchema,
  webhookOutConfigSchema,
  notificationConfigSchema,
  scriptConfigSchema,
  ruleConfigSchema,
]);

// ── Workflow Node ───────────────────────────────────────────

export const workflowNodeSchema = z.object({
  id: z.string().min(1),
  type: workflowNodeTypeSchema,
  label: z.string().optional(),
  editWindow: editWindowSchema.optional(),
  config: workflowNodeConfigSchema.optional(),
});

// ── Workflow Edge ───────────────────────────────────────────

export const workflowEdgeSchema = z.object({
  id: z.string().min(1),
  sourceNodeId: z.string().min(1),
  targetNodeId: z.string().min(1),
  label: z.string().optional(),
  condition: conditionJsonSchema.optional(),
  priority: z.number().int().min(0).optional(),
});

// ── Body Slot ───────────────────────────────────────────────

export const bodySlotSchema = z.object({
  slotId: z.string().min(1),
  entryNodeId: z.string().min(1),
  exitNodeId: z.string().min(1),
  defaultEditWindow: editWindowSchema,
  stableRegion: z.boolean(),
});

// ── Slot Graph Patch ────────────────────────────────────────

export const slotGraphPatchSchema = z.object({
  nodes: z.array(workflowNodeSchema),
  edges: z.array(workflowEdgeSchema),
  entryEdgeMode: entryEdgeModeSchema,
  exitEdgeMode: exitEdgeModeSchema,
  editWindowOverride: editWindowSchema.optional(),
});

// ── Org Workflow Definition ─────────────────────────────────

export const orgWorkflowDefinitionSchema = z.object({
  baseRef: z.object({
    entityType: z.string().min(1),
    envelopeVersion: z.number().int().positive(),
  }),
  slots: z.record(z.string(), slotGraphPatchSchema),
});

// ── Compiled Edge ───────────────────────────────────────────

export const compiledEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  priority: z.number().int().min(0),
  condition: conditionJsonSchema.optional(),
  label: z.string().optional(),
  provenance: z.string().min(1),
});

// ── Compiled Workflow ───────────────────────────────────────

export const compiledWorkflowSchema = z.object({
  adjacency: z.record(z.string(), z.array(z.string())),
  reverseAdjacency: z.record(z.string(), z.array(z.string())),
  edgesById: z.record(z.string(), compiledEdgeSchema),
  topologicalOrder: z.array(z.string()),
  joinRequirements: z.record(
    z.string(),
    z.object({
      requiredTokenCount: z.number().int().min(2),
      mode: joinModeSchema,
    }),
  ),
  editWindows: z.record(z.string(), editWindowSchema),
  stableRegionNodes: z.array(z.string()),
  slotMap: z.record(z.string(), z.string()),
  systemGateIntegrity: z.object({
    requiredGates: z.array(z.string()),
    presentGates: z.array(z.string()),
    valid: z.boolean(),
  }),
  envelopeVersion: z.number().int().positive(),
  compilerVersion: z.string().min(1),
  hash: z.string().min(1),
});

// ── Workflow Token ──────────────────────────────────────────

export const workflowTokenSchema = z.object({
  id: z.string().min(1),
  currentNodeId: z.string().min(1),
  status: z.enum(['active', 'waiting', 'completed', 'cancelled']),
  parentTokenId: z.string().optional(),
  spawnedFromNodeId: z.string().optional(),
  pathIndex: z.number().int().min(0).optional(),
  createdAt: z.string(),
});

// ── Step Result ─────────────────────────────────────────────

export const sideEffectRequestSchema = z.object({
  effectType: sideEffectTypeSchema,
  payload: z.record(z.string(), z.unknown()),
});

export const stepResultSchema = z.object({
  status: z.enum(['completed', 'failed', 'skipped']),
  output: z.record(z.string(), z.unknown()).optional(),
  error: z.string().optional(),
  chosenEdgeIds: z.array(z.string()).optional(),
  sideEffects: z.array(sideEffectRequestSchema).optional(),
});
