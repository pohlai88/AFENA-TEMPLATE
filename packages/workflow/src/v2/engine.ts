import { randomUUID } from 'node:crypto';

import { computeJoinIdempotencyKey, computeStepIdempotencyKey } from './canonical-json';
import { evaluateDsl } from './dsl-evaluator';
import { COMPILER_VERSION } from './types';

import type { DslContext } from './dsl-evaluator';
import type { NodeHandlerRegistry } from './nodes/types';
import type {
  CompiledWorkflow,
  ConditionJson,
  InstanceStatus,
  StepResult,
  WorkflowNode,
  WorkflowNodeConfig,
  WorkflowStepContext,
  WorkflowToken,
} from './types';

// ── Engine Error Codes ──────────────────────────────────────

export const ENGINE_ERRORS = {
  INSTANCE_NOT_FOUND: 'WORKFLOW_INSTANCE_NOT_FOUND',
  DEFINITION_NOT_FOUND: 'WORKFLOW_DEFINITION_NOT_FOUND',
  COMPILER_STALE: 'WORKFLOW_COMPILER_STALE',
  COMPILED_HASH_MISMATCH: 'WORKFLOW_COMPILED_HASH_MISMATCH',
  HANDLER_NOT_FOUND: 'WORKFLOW_HANDLER_NOT_FOUND',
  NODE_NOT_FOUND: 'WORKFLOW_NODE_NOT_FOUND',
  INSTANCE_TERMINAL: 'WORKFLOW_INSTANCE_TERMINAL',
  RECEIPT_DUPLICATE: 'WORKFLOW_RECEIPT_DUPLICATE',
  STABLE_REGION_DRIFT: 'WORKFLOW_STABLE_REGION_DRIFT',
  EDIT_WINDOW_LOCKED: 'WORKFLOW_EDIT_WINDOW_LOCKED',
} as const;

export type EngineErrorCode = (typeof ENGINE_ERRORS)[keyof typeof ENGINE_ERRORS];

export class WorkflowEngineError extends Error {
  constructor(
    public readonly code: EngineErrorCode,
    message: string,
    public readonly instanceId?: string,
  ) {
    super(message);
    this.name = 'WorkflowEngineError';
  }
}

// ── Instance Snapshot (in-memory representation) ────────────

export interface InstanceSnapshot {
  id: string;
  orgId: string;
  definitionId: string;
  definitionVersion: number;
  entityType: string;
  entityId: string;
  entityVersion: number;
  activeTokens: WorkflowToken[];
  currentNodes: string[];
  status: InstanceStatus;
  lastStepExecutionId: string | null;
  contextJson: Record<string, unknown>;
}

// ── Step Execution Record ───────────────────────────────────

export interface StepExecutionRecord {
  id: string;
  createdAt: string;
  orgId: string;
  instanceId: string;
  nodeId: string;
  nodeType: string;
  tokenId: string;
  entityVersion: number;
  status: string;
  runAs: string;
  idempotencyKey: string;
  inputJson: Record<string, unknown> | null;
  outputJson: Record<string, unknown> | null;
  error: string | null;
  actorUserId: string | null;
  chosenEdgeIds: string[];
}

// ── Advance Result ──────────────────────────────────────────

export interface AdvanceResult {
  stepExecutionId: string;
  nodeId: string;
  tokenId: string;
  result: StepResult;
  chosenEdgeIds: string[];
  nextNodes: string[];
  instanceCompleted: boolean;
}

// ── DB Adapter Interface ────────────────────────────────────
// The engine is DB-agnostic; it delegates all persistence to this adapter.

export interface WorkflowDbAdapter {
  /** Acquire advisory lock for single-writer (WF-01) */
  acquireAdvisoryLock(instanceId: string): Promise<void>;

  /** Load instance by ID */
  loadInstance(instanceId: string): Promise<InstanceSnapshot | null>;

  /** Load compiled workflow for a definition */
  loadCompiledWorkflow(definitionId: string, definitionVersion: number): Promise<{
    compiled: CompiledWorkflow;
    compiledHash: string;
    compilerVersion: string;
    nodesJson: WorkflowNode[];
  } | null>;

  /** Insert step receipt (WF-14: receipt-first). Returns false if duplicate. */
  insertStepReceipt(orgId: string, instanceId: string, idempotencyKey: string, stepExecutionId: string): Promise<boolean>;

  /** Insert step execution row */
  insertStepExecution(record: StepExecutionRecord): Promise<void>;

  /** Update step execution status + output */
  updateStepExecution(stepExecutionId: string, createdAt: string, update: {
    status: string;
    outputJson?: Record<string, unknown> | null;
    error?: string | null;
    completedAt?: string;
    durationMs?: number;
  }): Promise<void>;

  /** Update instance projection (incremental) */
  updateInstanceProjection(instanceId: string, update: {
    activeTokens: WorkflowToken[];
    currentNodes: string[];
    status: InstanceStatus;
    lastStepExecutionId: string;
    entityVersion: number;
    completedAt?: string;
  }): Promise<void>;

  /** Insert outbox receipt (WF-11). Returns false if duplicate. */
  insertOutboxReceipt(orgId: string, instanceId: string, sourceTable: string, eventIdempotencyKey: string): Promise<boolean>;

  /** Insert event outbox row */
  insertEventOutbox(record: {
    orgId: string;
    instanceId: string;
    entityVersion: number;
    definitionVersion: number;
    eventType: string;
    payloadJson: Record<string, unknown>;
    eventIdempotencyKey: string;
    traceId?: string;
  }): Promise<void>;

  /** Insert side-effect outbox row */
  insertSideEffectOutbox(record: {
    orgId: string;
    instanceId: string;
    stepExecutionId: string;
    effectType: string;
    payloadJson: Record<string, unknown>;
    eventIdempotencyKey: string;
    traceId?: string;
  }): Promise<void>;

  /** Insert join receipt (WF-16: join idempotency). Returns false if duplicate. */
  insertJoinReceipt(orgId: string, instanceId: string, joinIdempotencyKey: string): Promise<boolean>;

  /** Count completed tokens at a join node */
  countTokensAtJoin(instanceId: string, joinNodeId: string): Promise<number>;

  /** Cancel tokens (for ANY-join losers) */
  cancelTokenSteps(instanceId: string, tokenIds: string[], reason: string): Promise<void>;

  /** Create a new workflow instance */
  createInstance(instance: InstanceSnapshot): Promise<void>;
}

// ── Create Instance ─────────────────────────────────────────

export interface CreateInstanceInput {
  orgId: string;
  definitionId: string;
  definitionVersion: number;
  entityType: string;
  entityId: string;
  entityVersion: number;
  actorUserId: string;
  traceId?: string;
  contextJson?: Record<string, unknown>;
}

/**
 * Create a new workflow instance and advance through the start node.
 */
export async function createInstance(
  input: CreateInstanceInput,
  db: WorkflowDbAdapter,
  handlers: NodeHandlerRegistry,
): Promise<{ instanceId: string; advanceResult: AdvanceResult }> {
  const instanceId = randomUUID();
  const startTokenId = randomUUID();

  const startToken: WorkflowToken = {
    id: startTokenId,
    currentNodeId: 'sys:start',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  const instance: InstanceSnapshot = {
    id: instanceId,
    orgId: input.orgId,
    definitionId: input.definitionId,
    definitionVersion: input.definitionVersion,
    entityType: input.entityType,
    entityId: input.entityId,
    entityVersion: input.entityVersion,
    activeTokens: [startToken],
    currentNodes: ['sys:start'],
    status: 'running',
    lastStepExecutionId: null,
    contextJson: input.contextJson ?? {},
  };

  await db.createInstance(instance);

  // Advance through the start node immediately
  const advanceResult = await advanceWorkflow({
    instanceId,
    completedNodeId: 'sys:start',
    tokenId: startTokenId,
    entityVersion: input.entityVersion,
    actorUserId: input.actorUserId,
    ...(input.traceId ? { traceId: input.traceId } : {}),
    db,
    handlers,
  });

  return { instanceId, advanceResult };
}

// ── Advance Workflow ────────────────────────────────────────

export interface AdvanceWorkflowInput {
  instanceId: string;
  completedNodeId: string;
  tokenId: string;
  entityVersion: number;
  actorUserId: string;
  traceId?: string;
  db: WorkflowDbAdapter;
  handlers: NodeHandlerRegistry;
}

/**
 * Core engine loop: advanceWorkflow (PRD § Core Loop)
 *
 * 0. Advisory lock (WF-01)
 * 1. Load instance + compiled definition
 * 2. Verify compiled_hash (WF-07)
 * 3. Compute idempotency_key (WF-02)
 * 4-5. Receipt-first gate (WF-14)
 * 6. Insert step execution
 * 7. Verify stable region (WF-05)
 * 8. Dispatch handler
 * 9-11. Resolve outgoing edges
 * 12-13. Token move
 * 14. Projection update
 * 15. Check for completion
 */
export async function advanceWorkflow(input: AdvanceWorkflowInput): Promise<AdvanceResult> {
  const { instanceId, completedNodeId, tokenId, entityVersion, actorUserId, traceId, db, handlers } = input;

  // 0. Advisory lock (WF-01: single writer)
  await db.acquireAdvisoryLock(instanceId);

  // 1. Load instance
  const instance = await db.loadInstance(instanceId);
  if (!instance) {
    throw new WorkflowEngineError(ENGINE_ERRORS.INSTANCE_NOT_FOUND, `Instance ${instanceId} not found`, instanceId);
  }

  // Check terminal state
  if (instance.status === 'completed' || instance.status === 'failed' || instance.status === 'cancelled') {
    throw new WorkflowEngineError(
      ENGINE_ERRORS.INSTANCE_TERMINAL,
      `Instance ${instanceId} is in terminal state: ${instance.status}`,
      instanceId,
    );
  }

  // 1b. Load compiled definition
  const definition = await db.loadCompiledWorkflow(instance.definitionId, instance.definitionVersion);
  if (!definition) {
    throw new WorkflowEngineError(
      ENGINE_ERRORS.DEFINITION_NOT_FOUND,
      `Definition ${instance.definitionId} v${String(instance.definitionVersion)} not found`,
      instanceId,
    );
  }

  const { compiled, compilerVersion, nodesJson } = definition;

  // 2. Verify compiler version (WF-07)
  if (compilerVersion !== COMPILER_VERSION) {
    throw new WorkflowEngineError(
      ENGINE_ERRORS.COMPILER_STALE,
      `Compiled with ${compilerVersion}, engine requires ${COMPILER_VERSION}. Recompile definition.`,
      instanceId,
    );
  }

  // 3. Compute idempotency key (WF-02)
  const idempotencyKey = computeStepIdempotencyKey(instanceId, completedNodeId, tokenId, entityVersion);

  const stepExecutionId = randomUUID();
  const now = new Date().toISOString();

  // 4-5. Receipt-first gate (WF-14)
  const receiptInserted = await db.insertStepReceipt(instance.orgId, instanceId, idempotencyKey, stepExecutionId);
  if (!receiptInserted) {
    // Idempotent skip — this step was already executed
    return {
      stepExecutionId: '',
      nodeId: completedNodeId,
      tokenId,
      result: { status: 'skipped' },
      chosenEdgeIds: [],
      nextNodes: [],
      instanceCompleted: false,
    };
  }

  // Find the node in the definition
  const node = nodesJson.find((n) => n.id === completedNodeId);
  if (!node) {
    throw new WorkflowEngineError(
      ENGINE_ERRORS.NODE_NOT_FOUND,
      `Node ${completedNodeId} not found in definition`,
      instanceId,
    );
  }

  // 6. Insert step execution row
  const stepRecord: StepExecutionRecord = {
    id: stepExecutionId,
    createdAt: now,
    orgId: instance.orgId,
    instanceId,
    nodeId: completedNodeId,
    nodeType: node.type,
    tokenId,
    entityVersion,
    status: 'running',
    runAs: 'actor',
    idempotencyKey,
    inputJson: null,
    outputJson: null,
    error: null,
    actorUserId,
    chosenEdgeIds: [],
  };
  await db.insertStepExecution(stepRecord);

  // 7. Verify stable region (WF-05)
  if (compiled.stableRegionNodes.includes(completedNodeId)) {
    if (entityVersion !== instance.entityVersion) {
      throw new WorkflowEngineError(
        ENGINE_ERRORS.STABLE_REGION_DRIFT,
        `Entity version drift in stable region: expected ${String(instance.entityVersion)}, got ${String(entityVersion)}. Amendment required (WF-05).`,
        instanceId,
      );
    }
  }

  // 8. Dispatch handler
  const handler = handlers.get(node.type);
  if (!handler) {
    throw new WorkflowEngineError(
      ENGINE_ERRORS.HANDLER_NOT_FOUND,
      `No handler registered for node type: ${node.type}`,
      instanceId,
    );
  }

  const nodeRunAs = (node.config as { runAs?: string } | undefined)?.runAs ?? 'actor';
  const stepCtx: WorkflowStepContext = {
    instanceId,
    nodeId: completedNodeId,
    tokenId,
    entityType: instance.entityType,
    entityId: instance.entityId,
    entityVersion,
    actorUserId,
    runAs: nodeRunAs as WorkflowStepContext['runAs'],
    actor: { userId: actorUserId, orgId: instance.orgId },
    orgId: instance.orgId,
    ...(traceId ? { traceId } : {}),
    compiled,
    contextJson: instance.contextJson,
    ...(instance.contextJson['entity'] ? { entitySnapshot: instance.contextJson['entity'] as Record<string, unknown> } : {}),
  };

  let result: StepResult;
  try {
    result = await handler.execute(stepCtx, node.config ?? ({} as WorkflowNodeConfig));
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    result = { status: 'failed', error: errorMessage };
  }

  // 9-11. Resolve outgoing edges
  const outgoingEdgeIds = compiled.adjacency[completedNodeId] ?? [];
  const chosenEdgeIds: string[] = result.chosenEdgeIds ?? [];
  const nextNodes: string[] = [];

  if (result.status === 'completed' && chosenEdgeIds.length === 0) {
    // Auto-resolve: evaluate edges by priority (WF-13)
    const sortedEdges = outgoingEdgeIds
      .map((edgeId) => compiled.edgesById[edgeId])
      .filter(Boolean)
      .sort((a, b) => {
        if (!a || !b) return 0;
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.id.localeCompare(b.id);
      });

    // Build DSL context for condition evaluation
    const dslCtx: DslContext = {
      entity: instance.contextJson['entity'] as Record<string, unknown> ?? {},
      context: instance.contextJson,
      actor: { user_id: actorUserId },
      tokens: {},
    };

    for (const edge of sortedEdges) {
      if (!edge) continue;

      if (!edge.condition) {
        // Unconditional edge — always taken
        chosenEdgeIds.push(edge.id);
        nextNodes.push(edge.target);
        break; // Single-token: take first matching edge
      }

      // Evaluate condition via DSL evaluator
      const conditionResult = evaluateEdgeCondition(edge.condition, dslCtx);
      if (conditionResult) {
        chosenEdgeIds.push(edge.id);
        nextNodes.push(edge.target);
        break; // Single-token: take first matching edge
      }
    }

    // Fallback: if no edge matched (all conditions false), take first edge
    if (chosenEdgeIds.length === 0 && sortedEdges.length > 0) {
      const firstEdge = sortedEdges[0];
      if (firstEdge) {
        chosenEdgeIds.push(firstEdge.id);
        nextNodes.push(firstEdge.target);
      }
    }
  }

  // Update step execution with result
  const completedAt = new Date().toISOString();
  const startedMs = new Date(now).getTime();
  const completedMs = new Date(completedAt).getTime();

  await db.updateStepExecution(stepExecutionId, now, {
    status: result.status,
    outputJson: {
      ...result.output,
      chosenEdgeIds,
    },
    error: result.error ?? null,
    completedAt,
    durationMs: completedMs - startedMs,
  });

  // 12. Handle side effects (WF-10: enqueue-only handlers)
  if (result.sideEffects && result.sideEffects.length > 0) {
    for (const effect of result.sideEffects) {
      await db.insertSideEffectOutbox({
        orgId: instance.orgId,
        instanceId,
        stepExecutionId,
        effectType: effect.effectType,
        payloadJson: effect.payload,
        eventIdempotencyKey: `${stepExecutionId}:${effect.effectType}`,
        ...(traceId ? { traceId } : {}),
      });
    }
  }

  // 12b. Handle wait_timer / wait_event — override step status to 'pending'
  const isWaitTimer = node.type === 'wait_timer' && result.output?.['__waitTimer'] === true;
  const isWaitEvent = node.type === 'wait_event' && result.output?.['__waitEvent'] === true;

  if (isWaitTimer || isWaitEvent) {
    // Wait nodes don't advance — step stays pending, token enters 'waiting' state
    await db.updateStepExecution(stepExecutionId, now, {
      status: 'pending',
      outputJson: result.output ?? null,
    });

    // Update token status to 'waiting' (PRD §846: active → waiting)
    const waitingTokens = instance.activeTokens.map((t) => {
      if (t.id === tokenId) return { ...t, status: 'waiting' as const };
      return t;
    });
    await db.updateInstanceProjection(instanceId, {
      activeTokens: waitingTokens,
      currentNodes: waitingTokens.filter((t) => t.status === 'active' || t.status === 'waiting').map((t) => t.currentNodeId),
      status: 'running',
      lastStepExecutionId: stepExecutionId,
      entityVersion,
    });

    // No token move — instance stays running
    return {
      stepExecutionId,
      nodeId: completedNodeId,
      tokenId,
      result: { ...result, status: 'skipped' },
      chosenEdgeIds: [],
      nextNodes: [],
      instanceCompleted: false,
    };
  }

  // 13-14. Token move + projection update
  let updatedTokens: WorkflowToken[];

  if (node.type === 'parallel_split' && chosenEdgeIds.length > 1) {
    // PARALLEL SPLIT: spawn child tokens, one per chosen edge
    const spawnedTokenIds: string[] = [];
    const childTokens: WorkflowToken[] = [];

    for (let i = 0; i < chosenEdgeIds.length; i++) {
      const edgeId = chosenEdgeIds[i];
      if (!edgeId) continue;
      const edge = compiled.edgesById[edgeId];
      if (!edge) continue;
      const childTokenId = randomUUID();
      spawnedTokenIds.push(childTokenId);
      childTokens.push({
        id: childTokenId,
        currentNodeId: edge.target,
        status: 'active',
        parentTokenId: tokenId,
        spawnedFromNodeId: completedNodeId,
        pathIndex: i,
        createdAt: completedAt,
      });
      nextNodes.push(edge.target);
    }

    // Parent token completes, child tokens are active
    updatedTokens = instance.activeTokens.map((t) => {
      if (t.id === tokenId) return { ...t, status: 'completed' as const };
      return t;
    });
    updatedTokens.push(...childTokens);

    // Store spawned token IDs in step output for projection rebuild
    await db.updateStepExecution(stepExecutionId, now, {
      status: 'completed',
      outputJson: { ...result.output, chosenEdgeIds, spawnedTokenIds },
      completedAt,
      durationMs: completedMs - startedMs,
    });
  } else if (node.type === 'parallel_join') {
    // PARALLEL JOIN: WF-16 join idempotency
    const joinReq = compiled.joinRequirements[completedNodeId];

    if (joinReq) {
      const joinEpoch = instance.contextJson['__joinEpoch'] as number ?? 0;
      const joinKey = computeJoinIdempotencyKey(instanceId, completedNodeId, entityVersion, joinEpoch);
      const joinInserted = await db.insertJoinReceipt(instance.orgId, instanceId, joinKey);

      if (!joinInserted && joinReq.mode === 'any') {
        // ANY-join: this token lost — cancel it
        updatedTokens = instance.activeTokens.map((t) => {
          if (t.id === tokenId) return { ...t, status: 'cancelled' as const };
          return t;
        });
      } else {
        // Check if join is satisfied
        const tokensAtJoin = await db.countTokensAtJoin(instanceId, completedNodeId);

        if (joinReq.mode === 'any') {
          // ANY: first token wins — cancel all other tokens at this join
          const loserTokenIds = instance.activeTokens
            .filter((t) => t.id !== tokenId && t.status === 'active' && t.parentTokenId)
            .map((t) => t.id);

          if (loserTokenIds.length > 0) {
            await db.cancelTokenSteps(instanceId, loserTokenIds, 'any_join_loser');
          }

          updatedTokens = instance.activeTokens.map((t) => {
            if (t.id === tokenId) {
              // Winner advances
              const nextNode = nextNodes[0];
              if (nextNode) return { ...t, currentNodeId: nextNode };
              return { ...t, status: 'completed' as const };
            }
            if (loserTokenIds.includes(t.id)) return { ...t, status: 'cancelled' as const };
            return t;
          });
        } else {
          // ALL: check if all tokens arrived
          if (tokensAtJoin + 1 >= joinReq.requiredTokenCount) {
            // All arrived — advance
            updatedTokens = instance.activeTokens.map((t) => {
              if (t.id === tokenId) {
                const nextNode = nextNodes[0];
                if (nextNode) return { ...t, currentNodeId: nextNode };
                return { ...t, status: 'completed' as const };
              }
              // Complete all sibling tokens at the join
              if (t.parentTokenId && t.status === 'active') {
                return { ...t, status: 'completed' as const };
              }
              return t;
            });
          } else {
            // Not all arrived — this token waits
            updatedTokens = instance.activeTokens.map((t) => t);
          }
        }
      }
    } else {
      // No join requirements — treat as normal node
      updatedTokens = instance.activeTokens.map((t) => {
        if (t.id === tokenId) {
          const nextNode = nextNodes[0];
          if (nextNode) return { ...t, currentNodeId: nextNode };
          return { ...t, status: 'completed' as const };
        }
        return t;
      });
    }
  } else {
    // Normal single-token advancement
    updatedTokens = instance.activeTokens.map((t) => {
      if (t.id === tokenId) {
        const nextNode = nextNodes[0];
        if (nextNode) {
          return { ...t, currentNodeId: nextNode };
        }
        return { ...t, status: 'completed' as const };
      }
      return t;
    });
  }

  const activeTokens = updatedTokens.filter((t) => t.status === 'active');
  const currentNodes = activeTokens.map((t) => t.currentNodeId);

  // 15. Check for completion
  let instanceCompleted = false;
  let newStatus: InstanceStatus = instance.status;

  if (result.status === 'failed') {
    newStatus = 'failed';
  } else if (nextNodes.some((n) => n === 'sys:end') || activeTokens.length === 0) {
    newStatus = 'completed';
    instanceCompleted = true;
  }

  await db.updateInstanceProjection(instanceId, {
    activeTokens: updatedTokens,
    currentNodes,
    status: newStatus,
    lastStepExecutionId: stepExecutionId,
    entityVersion,
    ...(instanceCompleted ? { completedAt } : {}),
  });

  return {
    stepExecutionId,
    nodeId: completedNodeId,
    tokenId,
    result,
    chosenEdgeIds,
    nextNodes,
    instanceCompleted,
  };
}

// ── Edge Condition Evaluation ──────────────────────────────

/**
 * Evaluate an edge condition using the DSL evaluator.
 *
 * ConditionJson supports two shapes:
 * - `{ type: 'expression', params: { expr: string } }` — DSL expression
 * - `{ type: 'always_true' }` — unconditional (convenience)
 *
 * Returns true if the condition is satisfied, false otherwise.
 * Errors during evaluation are treated as false (edge not taken).
 */
function evaluateEdgeCondition(condition: ConditionJson, dslCtx: DslContext): boolean {
  try {
    if (condition.type === 'always_true') return true;
    if (condition.type === 'always_false') return false;

    if (condition.type === 'expression' && condition.params) {
      const expr = condition.params['expr'];
      if (typeof expr !== 'string') return false;
      const result = evaluateDsl({ expr }, dslCtx);
      return Boolean(result);
    }

    // Unknown condition type — treat as false (safe default)
    return false;
  } catch {
    // Condition evaluation errors → edge not taken (safe default)
    return false;
  }
}
