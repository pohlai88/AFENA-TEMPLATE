// ── V2 Types ────────────────────────────────────────────────
export type {
  WorkflowNodeType,
  DefinitionStatus,
  DefinitionKind,
  InstanceStatus,
  StepStatus,
  OutboxStatus,
  EditWindow,
  RunAsMode,
  TriggerType,
  SideEffectType,
  EntryEdgeMode,
  ExitEdgeMode,
  JoinMode,
  DslExpression,
  ConditionJson,
  WorkflowNode,
  WorkflowNodeConfig,
  MutationSpecRef,
  ActionNodeConfig,
  ApprovalNodeConfig,
  ConditionNodeConfig,
  LifecycleGateConfig,
  PolicyGateConfig,
  ParallelSplitConfig,
  ParallelJoinConfig,
  WaitTimerConfig,
  WaitEventConfig,
  WebhookOutConfig,
  NotificationConfig,
  ScriptConfig,
  RuleConfig,
  WorkflowEdge,
  BodySlot,
  SlotGraphPatch,
  OrgWorkflowDefinition,
  CompiledEdge,
  JoinRequirement,
  SystemGateIntegrity,
  CompiledWorkflow,
  WorkflowToken,
  StepResult,
  SideEffectRequest,
  WorkflowStepContext,
  WorkflowNodeHandler,
} from './types';

export {
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
  COMPILER_VERSION,
} from './types';

// ── V2 Schemas ──────────────────────────────────────────────
export {
  workflowNodeTypeSchema,
  definitionStatusSchema,
  definitionKindSchema,
  instanceStatusSchema,
  stepStatusSchema,
  outboxStatusSchema,
  editWindowSchema,
  runAsModeSchema,
  triggerTypeSchema,
  sideEffectTypeSchema,
  entryEdgeModeSchema,
  exitEdgeModeSchema,
  joinModeSchema,
  dslExpressionSchema,
  conditionJsonSchema,
  mutationSpecRefSchema,
  workflowNodeConfigSchema,
  workflowNodeSchema,
  workflowEdgeSchema,
  bodySlotSchema,
  slotGraphPatchSchema,
  orgWorkflowDefinitionSchema,
  compiledEdgeSchema,
  compiledWorkflowSchema,
  workflowTokenSchema,
  stepResultSchema,
} from './schemas';

// ── Canonical JSON ──────────────────────────────────────────
export {
  canonicalJsonSerialize,
  canonicalJsonHash,
  computeStepIdempotencyKey,
  computeEventIdempotencyKey,
  computeSideEffectIdempotencyKey,
  computeJoinIdempotencyKey,
} from './canonical-json';

// ── Envelope Generator ──────────────────────────────────────
export { generateEnvelope } from './envelope-generator';

// ── Slot Validator ──────────────────────────────────────────
export { validateSlotPatch } from './slot-validator';

// ── Merge Compiler ──────────────────────────────────────────
export { compileEffective } from './merge-compiler';

// ── DAG Validator ───────────────────────────────────────────
export { validateDag } from './dag-validator';
export { topologicalSort } from './dag-validator';

// ── Engine ──────────────────────────────────────────────────
export {
  createInstance,
  advanceWorkflow,
  WorkflowEngineError,
  ENGINE_ERRORS,
} from './engine';
export type {
  InstanceSnapshot,
  StepExecutionRecord,
  AdvanceResult,
  AdvanceWorkflowInput,
  CreateInstanceInput,
  WorkflowDbAdapter,
  EngineErrorCode,
} from './engine';

// ── Drizzle DB Adapter ─────────────────────────────────────
export { DrizzleWorkflowDbAdapter } from './drizzle-db-adapter';

// ── Edit Window ─────────────────────────────────────────────
export { checkEditWindow, getEffectiveEditWindow } from './edit-window';

// ── DSL Evaluator ───────────────────────────────────────────
export {
  evaluateDsl,
  validateDslExpression,
  DslEvaluationError,
} from './dsl-evaluator';
export type { DslContext } from './dsl-evaluator';

// ── DSL Safety ──────────────────────────────────────────────
export {
  validateDslSafety,
  MAX_DSL_AST_DEPTH,
  MAX_DSL_DEREFERENCES,
  MAX_DSL_LENGTH,
  FORBIDDEN_DSL_OPS,
} from './dsl-safety';
export type { DslSafetyResult } from './dsl-safety';

// ── Invariants ──────────────────────────────────────────────
export {
  assertWF01_SingleWriter,
  assertWF02_StepIdempotency,
  assertWF03_VersionPinnedApproval,
  assertWF04_PublishedImmutability,
  assertWF05_StableRegionVersion,
  assertWF06_SlotScope,
  assertWF07_CompilerVersion,
  assertWF08_SystemGateIntegrity,
  assertWF09_NoDirectWrites,
  assertWF10_SideEffectsViaOutbox,
  assertWF11_OutboxIdempotency,
  assertWF12_DeterministicCompile,
  assertWF13_DeterministicEdgeOrder,
  assertWF14_ReceiptFirstGate,
  assertWF15_ProjectionMatch,
  assertWF16_JoinIdempotency,
} from './invariants';

// ── Compiled Cache ──────────────────────────────────────────
export { CompiledWorkflowCache } from './compiled-cache';

// ── Outbox Writer ───────────────────────────────────────────
export { writeEventToOutbox, enqueueWorkflowTrigger } from './outbox-writer';
export type { OutboxWriteRequest, OutboxEventType } from './outbox-writer';

// ── Engine Worker ───────────────────────────────────────────
export {
  processOutboxEvent,
  pollAndProcess,
  startWorkerLoop,
} from './engine-worker';
export type {
  OutboxEventRow,
  WorkerDbAdapter,
  WorkerConfig,
} from './engine-worker';

// ── V1 Bridge ───────────────────────────────────────────────
export { executeV1Rules } from './v1-bridge';
export type { V1EvaluateRulesFn } from './v1-bridge';

// ── Node Handlers ───────────────────────────────────────────
export {
  createHandlerRegistry,
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
} from './nodes';
export type { NodeHandlerRegistry } from './nodes';

// ── Approval Resolver (Phase 2) ─────────────────────────────
export {
  resolveApprovers,
  createChainApprovalRequest,
  processChainDecision,
  createInlineApprovalRequest,
} from './approval-resolver';
export type {
  ResolvedApprover,
  ApprovalRequestResult,
  ApprovalDecisionInput,
  ApprovalDecisionResult,
  ApprovalDbAdapter,
} from './approval-resolver';

// ── Resume Scheduler (Phase 2) ─────────────────────────────
export {
  processDueTimers,
  resumeByEventKey,
  startResumeSchedulerLoop,
} from './resume-scheduler';
export type {
  DueStep,
  ResumeSchedulerConfig,
  ResumeSchedulerDbAdapter,
} from './resume-scheduler';

// ── IO Worker (Phase 2) ────────────────────────────────────
export {
  processSideEffect,
  pollAndProcessSideEffects,
  startIoWorkerLoop,
} from './io-worker';
export type {
  SideEffectRow,
  IoWorkerDbAdapter,
  SideEffectExecutor,
  SideEffectExecutorRegistry,
  IoWorkerConfig,
} from './io-worker';

// ── Projection Rebuild (Phase 2) ───────────────────────────
export { rebuildInstanceProjection } from './projection';
export type {
  StepExecutionSummary,
  RebuildResult,
  ProjectionDbAdapter,
} from './projection';

// ── Stuck Detector (Phase 3) ────────────────────────────────
export { detectStuckInstances } from './stuck-detector';
export type {
  StuckInstance,
  StuckDetectorConfig,
  StuckDetectorDbAdapter,
  StuckInstanceRow,
  SuggestedAction,
} from './stuck-detector';

// ── Receipts Pruner (Phase 2) ──────────────────────────────
export { pruneReceipts } from './receipts-pruner';
export type {
  ReceiptsPrunerDbAdapter,
  PrunerConfig,
  PruneResult,
} from './receipts-pruner';
