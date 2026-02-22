import type { CompiledWorkflow, InstanceStatus, WorkflowToken } from './types';

/**
 * Projection rebuild utility — reconstructs instance state from step_executions.
 *
 * PRD § WF-15:
 * > Token position determinism. For any instance, the set of executable nodes
 * > is derivable from compiled DAG + step_executions alone, independent of
 * > workflow_instances projection.
 *
 * rebuild_instance_projection() must produce identical active_tokens + current_nodes
 * from step_executions + compiled DAG.
 */

export interface StepExecutionSummary {
  id: string;
  nodeId: string;
  nodeType: string;
  tokenId: string;
  status: string;
  entityVersion: number;
  outputJson: Record<string, unknown> | null;
  chosenEdgeIds: string[];
}

export interface RebuildResult {
  activeTokens: WorkflowToken[];
  currentNodes: string[];
  status: InstanceStatus;
  lastStepExecutionId: string | null;
  entityVersion: number;
}

export interface ProjectionDbAdapter {
  /** Load all step executions for an instance, ordered by created_at ASC */
  loadStepExecutions(instanceId: string): Promise<StepExecutionSummary[]>;

  /** Load the compiled workflow for the instance's definition */
  loadCompiledForInstance(instanceId: string): Promise<CompiledWorkflow | null>;
}

/**
 * Rebuild the instance projection from step_executions + compiled DAG.
 *
 * Algorithm:
 * 1. Load all step executions ordered by created_at
 * 2. Replay token movements through the compiled DAG
 * 3. Derive current active_tokens, current_nodes, status
 *
 * This is the recovery path — used when projection drift is detected
 * or as a CI verification tool (WF-15).
 */
export function rebuildInstanceProjection(
  steps: StepExecutionSummary[],
  compiled: CompiledWorkflow,
): RebuildResult {
  if (steps.length === 0) {
    return {
      activeTokens: [],
      currentNodes: [],
      status: 'running',
      lastStepExecutionId: null,
      entityVersion: 0,
    };
  }

  // Track token states: tokenId → current position
  const tokenPositions = new Map<string, { nodeId: string; status: 'active' | 'completed' | 'cancelled' }>();
  // Track spawned tokens from parallel splits
  const spawnedTokens = new Map<string, string>(); // childTokenId → parentTokenId

  let lastStepId: string | null = null;
  let lastEntityVersion = 0;
  let instanceFailed = false;

  for (const step of steps) {
    lastStepId = step.id;
    lastEntityVersion = step.entityVersion;

    if (step.status === 'failed') {
      instanceFailed = true;
      tokenPositions.set(step.tokenId, { nodeId: step.nodeId, status: 'active' });
      continue;
    }

    if (step.status === 'skipped' || step.status === 'cancelled') {
      // Token was cancelled (e.g., ANY-join loser) or skipped (ALL-join waiting)
      if (step.status === 'cancelled') {
        tokenPositions.set(step.tokenId, { nodeId: step.nodeId, status: 'cancelled' });
      }
      continue;
    }

    if (step.status !== 'completed') {
      // pending/running — token is still at this node
      tokenPositions.set(step.tokenId, { nodeId: step.nodeId, status: 'active' });
      continue;
    }

    // Step completed — resolve next position
    const chosenEdgeIds = step.chosenEdgeIds ?? [];
    const nodeType = step.nodeType;

    if (nodeType === 'end') {
      tokenPositions.set(step.tokenId, { nodeId: step.nodeId, status: 'completed' });
      continue;
    }

    if (nodeType === 'parallel_split' && chosenEdgeIds.length > 1) {
      // Spawn child tokens — one per chosen edge
      tokenPositions.set(step.tokenId, { nodeId: step.nodeId, status: 'completed' });

      for (const edgeId of chosenEdgeIds) {
        const edge = compiled.edgesById[edgeId];
        if (edge) {
          // Child token IDs are embedded in the output by the engine
          const spawnedIds = step.outputJson?.['spawnedTokenIds'] as string[] | undefined;
          if (spawnedIds) {
            const idx = chosenEdgeIds.indexOf(edgeId);
            const childTokenId = spawnedIds[idx];
            if (childTokenId) {
              tokenPositions.set(childTokenId, { nodeId: edge.target, status: 'active' });
              spawnedTokens.set(childTokenId, step.tokenId);
            }
          }
        }
      }
      continue;
    }

    // Normal single-edge advancement
    if (chosenEdgeIds.length > 0) {
      const firstEdgeId = chosenEdgeIds[0];
      const edge = firstEdgeId ? compiled.edgesById[firstEdgeId] : undefined;
      if (edge) {
        tokenPositions.set(step.tokenId, { nodeId: edge.target, status: 'active' });
      } else {
        tokenPositions.set(step.tokenId, { nodeId: step.nodeId, status: 'completed' });
      }
    } else {
      // No edges chosen — auto-resolve from adjacency
      const outgoing = compiled.adjacency[step.nodeId] ?? [];
      const firstOutId = outgoing[0];
      if (firstOutId) {
        const firstEdge = compiled.edgesById[firstOutId];
        if (firstEdge) {
          tokenPositions.set(step.tokenId, { nodeId: firstEdge.target, status: 'active' });
        }
      } else {
        tokenPositions.set(step.tokenId, { nodeId: step.nodeId, status: 'completed' });
      }
    }
  }

  // Build final state
  const activeTokens: WorkflowToken[] = [];
  for (const [tokenId, pos] of tokenPositions) {
    const parentId = spawnedTokens.get(tokenId);
    activeTokens.push({
      id: tokenId,
      currentNodeId: pos.nodeId,
      status: pos.status,
      ...(parentId ? { parentTokenId: parentId } : {}),
      createdAt: new Date().toISOString(),
    });
  }

  const currentNodes = activeTokens
    .filter((t) => t.status === 'active')
    .map((t) => t.currentNodeId);

  // Determine instance status
  let status: InstanceStatus = 'running';
  if (instanceFailed) {
    status = 'failed';
  } else if (activeTokens.every((t) => t.status === 'completed' || t.status === 'cancelled')) {
    status = 'completed';
  } else if (currentNodes.some((n) => n === 'sys:end')) {
    status = 'completed';
  }

  return {
    activeTokens,
    currentNodes,
    status,
    lastStepExecutionId: lastStepId,
    entityVersion: lastEntityVersion,
  };
}
