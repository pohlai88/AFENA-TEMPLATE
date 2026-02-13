import type { WorkflowNodeHandler } from './types';
import type {
  ParallelSplitConfig,
  StepResult,
  WorkflowNodeConfig,
  WorkflowStepContext,
} from '../types';

/**
 * parallel_split handler — fork into parallel paths.
 *
 * Returns ALL outgoing edge IDs as chosenEdgeIds. The engine is responsible
 * for spawning one child token per chosen edge (token move logic in engine.ts).
 *
 * PRD § Parallel:
 * > parallel_split spawns tokens. One token per outgoing edge.
 * > The split node itself completes immediately.
 */
export const parallelSplitHandler: WorkflowNodeHandler = {
  nodeType: 'parallel_split',

  async execute(ctx: WorkflowStepContext, _config: WorkflowNodeConfig): Promise<StepResult> {
    const splitConfig = _config as ParallelSplitConfig;

    // Resolve all outgoing edges — the engine will spawn tokens for each
    const outgoingEdgeIds = ctx.compiled.adjacency[ctx.nodeId] ?? [];

    if (outgoingEdgeIds.length === 0) {
      return {
        status: 'failed',
        error: `parallel_split node "${ctx.nodeId}" has no outgoing edges`,
      };
    }

    return {
      status: 'completed',
      chosenEdgeIds: outgoingEdgeIds,
      output: {
        branchCount: splitConfig.branchCount ?? outgoingEdgeIds.length,
        spawnedEdges: outgoingEdgeIds,
      },
    };
  },
};

/**
 * parallel_join handler — synchronize parallel paths.
 *
 * PRD § Parallel Join:
 * - ALL mode: wait until all required tokens have arrived. Only the last token fires the join.
 * - ANY mode: first token wins. Losers get cancelled step rows for audit.
 *
 * WF-16: Join idempotency via join_idempotency_key in step_receipts.
 * The engine handles the join receipt INSERT before dispatching this handler.
 * This handler only needs to check whether the join condition is satisfied.
 *
 * The join state is tracked via the instance's activeTokens — the engine
 * passes context about how many tokens have arrived at this join node.
 */
export const parallelJoinHandler: WorkflowNodeHandler = {
  nodeType: 'parallel_join',

  async execute(ctx: WorkflowStepContext, _config: WorkflowNodeConfig): Promise<StepResult> {
    const joinReq = ctx.compiled.joinRequirements[ctx.nodeId];

    if (!joinReq) {
      return {
        status: 'failed',
        error: `parallel_join node "${ctx.nodeId}" has no join requirements in compiled definition`,
      };
    }

    // Count how many tokens are currently at this join node
    const tokensAtJoin = ctx.contextJson['__tokensAtJoin'] as number | undefined ?? 0;
    const requiredCount = joinReq.requiredTokenCount;
    const mode = joinReq.mode;

    if (mode === 'any') {
      // ANY mode: first token wins immediately
      return {
        status: 'completed',
        output: {
          joinMode: 'any',
          tokensArrived: tokensAtJoin + 1,
          requiredCount,
          winner: ctx.tokenId,
        },
      };
    }

    // ALL mode: check if all required tokens have arrived
    if (tokensAtJoin + 1 >= requiredCount) {
      // All tokens arrived — fire the join
      return {
        status: 'completed',
        output: {
          joinMode: 'all',
          tokensArrived: tokensAtJoin + 1,
          requiredCount,
          allArrived: true,
        },
      };
    }

    // Not all tokens arrived yet — this token waits (skipped, not failed)
    return {
      status: 'skipped',
      output: {
        joinMode: 'all',
        tokensArrived: tokensAtJoin + 1,
        requiredCount,
        allArrived: false,
        waiting: true,
      },
    };
  },
};
