/**
 * Stuck Instance Detector — PRD §1339.
 *
 * Detects workflow instances that appear stuck:
 * - Instance status = 'running'
 * - No pending outbox events for that instance
 * - Last step older than configurable threshold
 * - Current node is NOT a wait_timer or wait_event
 *
 * Surfaces suggested actions: rebuild_projection, reenqueue_advance, force_fail.
 */

// ── Types ───────────────────────────────────────────────────

export type SuggestedAction = 'rebuild_projection' | 'reenqueue_advance' | 'force_fail';

export interface StuckInstance {
  instanceId: string;
  orgId: string;
  entityType: string;
  entityId: string;
  currentNodes: string[];
  lastStepAt: Date | null;
  stuckDurationMs: number;
  suggestedActions: SuggestedAction[];
}

export interface StuckDetectorConfig {
  /** Max age of last step before instance is considered stuck (ms). Default: 15 min. */
  staleThresholdMs: number;
  /** Max instances to return per scan. Default: 100. */
  limit: number;
}

export interface StuckDetectorDbAdapter {
  /**
   * Find running instances with no pending outbox events
   * where the last step is older than the threshold
   * and current nodes are not wait_timer/wait_event.
   */
  findStuckInstances(
    staleThresholdMs: number,
    limit: number,
  ): Promise<StuckInstanceRow[]>;
}

export interface StuckInstanceRow {
  instanceId: string;
  orgId: string;
  entityType: string;
  entityId: string;
  currentNodes: string[];
  lastStepAt: Date | null;
  hasProjectionMismatch: boolean;
}

// ── Constants ───────────────────────────────────────────────

const DEFAULT_STALE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_LIMIT = 100;

const WAIT_NODE_TYPES = new Set(['wait_timer', 'wait_event']);

// ── Detector ────────────────────────────────────────────────

/**
 * Detect stuck workflow instances.
 *
 * Returns instances that are running but appear to have stalled,
 * along with suggested remediation actions.
 */
export async function detectStuckInstances(
  db: StuckDetectorDbAdapter,
  config?: Partial<StuckDetectorConfig>,
): Promise<StuckInstance[]> {
  const staleThresholdMs = config?.staleThresholdMs ?? DEFAULT_STALE_THRESHOLD_MS;
  const limit = config?.limit ?? DEFAULT_LIMIT;

  const rows = await db.findStuckInstances(staleThresholdMs, limit);
  const now = Date.now();

  return rows
    .filter((row) => {
      // Exclude instances where all current nodes are wait nodes
      // (they're legitimately waiting, not stuck)
      if (row.currentNodes.length > 0 && row.currentNodes.every((n) => isWaitNode(n))) {
        return false;
      }
      return true;
    })
    .map((row) => {
      const lastStepTime = row.lastStepAt ? row.lastStepAt.getTime() : 0;
      const stuckDurationMs = now - lastStepTime;

      return {
        instanceId: row.instanceId,
        orgId: row.orgId,
        entityType: row.entityType,
        entityId: row.entityId,
        currentNodes: row.currentNodes,
        lastStepAt: row.lastStepAt,
        stuckDurationMs,
        suggestedActions: suggestActions(row, stuckDurationMs, staleThresholdMs),
      };
    });
}

// ── Helpers ─────────────────────────────────────────────────

/**
 * Check if a node ID corresponds to a wait node type.
 * Wait nodes have known prefixes from the envelope generator.
 */
function isWaitNode(nodeId: string): boolean {
  // Check for known wait node type prefixes
  for (const waitType of WAIT_NODE_TYPES) {
    if (nodeId.includes(waitType)) return true;
  }
  return false;
}

/**
 * Suggest remediation actions based on stuck instance characteristics.
 */
function suggestActions(
  row: StuckInstanceRow,
  stuckDurationMs: number,
  staleThresholdMs: number,
): SuggestedAction[] {
  const actions: SuggestedAction[] = [];

  // Always suggest re-enqueue as first action (safest)
  actions.push('reenqueue_advance');

  // If projection mismatch detected, suggest rebuild
  if (row.hasProjectionMismatch) {
    actions.unshift('rebuild_projection');
  }

  // If stuck for >3x the threshold, suggest force fail as last resort
  if (stuckDurationMs > staleThresholdMs * 3) {
    actions.push('force_fail');
  }

  return actions;
}
