/**
 * In-memory job quota enforcement.
 * Key: org_id + queue.
 *
 * MVP — no external deps. Sufficient for single-process deployments.
 * For multi-instance, swap the store for a shared backend.
 *
 * Spec §C2: Job quota key = org_id + queue.
 * - max concurrent jobs per org per queue
 * - max jobs enqueued per minute per org (optional)
 */

export interface JobQuotaConfig {
  /** Max concurrent running jobs per org per queue. */
  maxConcurrent: number;
  /** Max jobs enqueued per minute per org per queue. */
  maxEnqueuedPerMinute: number;
}

interface QueueState {
  /** Currently running job count. */
  running: number;
  /** Timestamps of enqueue events in the last minute. */
  enqueueTimestamps: number[];
}

/** Default presets per queue name. */
const QUEUE_DEFAULTS: Record<string, JobQuotaConfig> = {
  default: { maxConcurrent: 5, maxEnqueuedPerMinute: 30 },
  workflow: { maxConcurrent: 3, maxEnqueuedPerMinute: 20 },
  import: { maxConcurrent: 1, maxEnqueuedPerMinute: 5 },
  sync: { maxConcurrent: 2, maxEnqueuedPerMinute: 15 },
};

const DEFAULT_QUOTA: JobQuotaConfig = { maxConcurrent: 5, maxEnqueuedPerMinute: 30 };

/** In-memory store — keyed by "orgId:queue". */
const store = new Map<string, QueueState>();

/** Periodic cleanup interval (5 min). */
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    const oneMinuteAgo = now - 60_000;
    for (const [key, state] of store) {
      state.enqueueTimestamps = state.enqueueTimestamps.filter((t) => t > oneMinuteAgo);
      if (state.running === 0 && state.enqueueTimestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 300_000);
  if (typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }
}

function getState(orgId: string, queue: string): QueueState {
  const key = `${orgId}:${queue}`;
  let state = store.get(key);
  if (!state) {
    state = { running: 0, enqueueTimestamps: [] };
    store.set(key, state);
  }
  return state;
}

export type JobQuotaDenyReason = 'MAX_CONCURRENT' | 'MAX_ENQUEUED_PER_MINUTE';

export interface JobQuotaResult {
  allowed: boolean;
  reason?: JobQuotaDenyReason;
  currentConcurrent: number;
  maxConcurrent: number;
  enqueuedLastMinute: number;
  maxEnqueuedPerMinute: number;
}

/**
 * Check whether a new job can be enqueued for this org + queue.
 * If allowed, records the enqueue event and increments running count.
 * Caller MUST call `releaseJob()` when the job completes.
 */
export function acquireJobSlot(
  orgId: string,
  queue: string,
  configOverride?: Partial<JobQuotaConfig>,
): JobQuotaResult {
  ensureCleanup();

  const config: JobQuotaConfig = {
    ...(QUEUE_DEFAULTS[queue] ?? DEFAULT_QUOTA),
    ...configOverride,
  };

  const state = getState(orgId, queue);
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;

  // Prune old enqueue timestamps
  state.enqueueTimestamps = state.enqueueTimestamps.filter((t) => t > oneMinuteAgo);

  // Check concurrent limit
  if (state.running >= config.maxConcurrent) {
    return {
      allowed: false,
      reason: 'MAX_CONCURRENT',
      currentConcurrent: state.running,
      maxConcurrent: config.maxConcurrent,
      enqueuedLastMinute: state.enqueueTimestamps.length,
      maxEnqueuedPerMinute: config.maxEnqueuedPerMinute,
    };
  }

  // Check enqueue rate limit
  if (state.enqueueTimestamps.length >= config.maxEnqueuedPerMinute) {
    return {
      allowed: false,
      reason: 'MAX_ENQUEUED_PER_MINUTE',
      currentConcurrent: state.running,
      maxConcurrent: config.maxConcurrent,
      enqueuedLastMinute: state.enqueueTimestamps.length,
      maxEnqueuedPerMinute: config.maxEnqueuedPerMinute,
    };
  }

  // Acquire slot
  state.running += 1;
  state.enqueueTimestamps.push(now);

  return {
    allowed: true,
    currentConcurrent: state.running,
    maxConcurrent: config.maxConcurrent,
    enqueuedLastMinute: state.enqueueTimestamps.length,
    maxEnqueuedPerMinute: config.maxEnqueuedPerMinute,
  };
}

/**
 * Release a job slot when a job completes (success or failure).
 * MUST be called after acquireJobSlot() returns allowed=true.
 */
export function releaseJob(orgId: string, queue: string): void {
  const key = `${orgId}:${queue}`;
  const state = store.get(key);
  if (state && state.running > 0) {
    state.running -= 1;
  }
}

/**
 * Get current quota state for monitoring (read-only).
 */
export function getJobQuotaState(
  orgId: string,
  queue: string,
): { running: number; enqueuedLastMinute: number } {
  const state = getState(orgId, queue);
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;
  const recent = state.enqueueTimestamps.filter((t) => t > oneMinuteAgo);
  return { running: state.running, enqueuedLastMinute: recent.length };
}

/**
 * Get quota config for a queue (for reporting).
 */
export function getJobQuotaConfig(queue: string): JobQuotaConfig {
  return QUEUE_DEFAULTS[queue] ?? DEFAULT_QUOTA;
}

/**
 * Reset all quota state (testing only).
 */
export function _resetJobQuotaStore(): void {
  store.clear();
}
