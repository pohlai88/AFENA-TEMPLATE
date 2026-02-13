import type { NodeHandlerRegistry } from './nodes/types';
import { advanceWorkflow } from './engine';
import type { WorkflowDbAdapter } from './engine';

/**
 * Outbox event row — shape returned by the worker poll query.
 */
export interface OutboxEventRow {
  id: string;
  createdAt: string;
  orgId: string;
  instanceId: string;
  entityVersion: number;
  definitionVersion: number;
  eventType: string;
  payloadJson: Record<string, unknown>;
  eventIdempotencyKey: string;
  traceId: string | null;
  status: string;
  attempts: number;
  maxAttempts: number;
}

/**
 * Worker DB adapter — extends the engine adapter with outbox polling.
 */
export interface WorkerDbAdapter extends WorkflowDbAdapter {
  /**
   * Poll outbox for pending events using FOR UPDATE SKIP LOCKED.
   *
   * PRD § Outbox Worker Query Contract:
   * ```sql
   * SELECT * FROM workflow_events_outbox
   * WHERE status IN ('pending', 'failed')
   *   AND (next_retry_at IS NULL OR next_retry_at <= now())
   *   AND attempts < max_attempts
   * ORDER BY created_at ASC
   * LIMIT :batchSize
   * FOR UPDATE SKIP LOCKED
   * ```
   */
  pollOutboxEvents(batchSize: number): Promise<OutboxEventRow[]>;

  /** Mark outbox event as processing */
  markOutboxProcessing(id: string, createdAt: string): Promise<void>;

  /** Mark outbox event as completed */
  markOutboxCompleted(id: string, createdAt: string): Promise<void>;

  /** Mark outbox event as failed with retry scheduling */
  markOutboxFailed(id: string, createdAt: string, error: string, nextRetryAt: string | null): Promise<void>;

  /** Mark outbox event as dead letter */
  markOutboxDeadLetter(id: string, createdAt: string, error: string): Promise<void>;

  /**
   * Resolve the current node and token for an instance given an event.
   * Returns null if the instance has no active token at the expected position.
   */
  resolveActiveToken(instanceId: string): Promise<{
    nodeId: string;
    tokenId: string;
    entityVersion: number;
  } | null>;
}

/**
 * Worker configuration.
 */
export interface WorkerConfig {
  batchSize: number;
  pollIntervalMs: number;
  retryBackoffMs: number;
  maxRetryBackoffMs: number;
  shutdownSignal?: AbortSignal;
}

const DEFAULT_CONFIG: WorkerConfig = {
  batchSize: 100,
  pollIntervalMs: 1000,
  retryBackoffMs: 5000,
  maxRetryBackoffMs: 300_000, // 5 minutes
};

/**
 * Process a single outbox event.
 */
export async function processOutboxEvent(
  event: OutboxEventRow,
  db: WorkerDbAdapter,
  handlers: NodeHandlerRegistry,
): Promise<void> {
  // Mark as processing
  await db.markOutboxProcessing(event.id, event.createdAt);

  try {
    // Resolve the active token for this instance
    const token = await db.resolveActiveToken(event.instanceId);
    if (!token) {
      // Instance has no active token — mark completed (nothing to advance)
      await db.markOutboxCompleted(event.id, event.createdAt);
      return;
    }

    // Advance the workflow
    await advanceWorkflow({
      instanceId: event.instanceId,
      completedNodeId: token.nodeId,
      tokenId: token.tokenId,
      entityVersion: token.entityVersion,
      actorUserId: 'system', // Worker runs as system
      traceId: event.traceId ?? undefined,
      db,
      handlers,
    });

    // Mark as completed
    await db.markOutboxCompleted(event.id, event.createdAt);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    if (event.attempts + 1 >= event.maxAttempts) {
      // Max attempts reached — dead letter
      await db.markOutboxDeadLetter(event.id, event.createdAt, errorMessage);
    } else {
      // Schedule retry with exponential backoff
      const backoffMs = Math.min(
        DEFAULT_CONFIG.retryBackoffMs * Math.pow(2, event.attempts),
        DEFAULT_CONFIG.maxRetryBackoffMs,
      );
      const nextRetryAt = new Date(Date.now() + backoffMs).toISOString();
      await db.markOutboxFailed(event.id, event.createdAt, errorMessage, nextRetryAt);
    }
  }
}

/**
 * Run a single poll cycle — fetch batch + process each event.
 * Returns the number of events processed.
 */
export async function pollAndProcess(
  db: WorkerDbAdapter,
  handlers: NodeHandlerRegistry,
  batchSize: number = DEFAULT_CONFIG.batchSize,
): Promise<number> {
  const events = await db.pollOutboxEvents(batchSize);

  for (const event of events) {
    await processOutboxEvent(event, db, handlers);
  }

  return events.length;
}

/**
 * Start the engine worker loop.
 *
 * Polls the outbox at a fixed interval, processes events, and respects
 * the shutdown signal for graceful termination.
 */
export async function startWorkerLoop(
  db: WorkerDbAdapter,
  handlers: NodeHandlerRegistry,
  config: Partial<WorkerConfig> = {},
): Promise<void> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  while (!cfg.shutdownSignal?.aborted) {
    const processed = await pollAndProcess(db, handlers, cfg.batchSize);

    // If no events were processed, wait before next poll
    // If events were processed, poll again immediately (drain mode)
    if (processed === 0) {
      await sleep(cfg.pollIntervalMs, cfg.shutdownSignal);
    }
  }
}

/**
 * Sleep for a duration, respecting abort signal.
 */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }

    const timer = setTimeout(resolve, ms);

    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
  });
}
