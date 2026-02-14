import { advanceWorkflow, createInstance } from './engine';

import type { WorkflowDbAdapter } from './engine';
import type { NodeHandlerRegistry } from './nodes/types';

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

  /**
   * Look up the published effective definition for an entity type.
   * Used by the worker to create new instances on entity_created events.
   * Returns null if no published effective definition exists.
   */
  lookupPublishedDefinition(orgId: string, entityType: string): Promise<{
    definitionId: string;
    definitionVersion: number;
  } | null>;

  /**
   * Check if a running/paused workflow instance already exists for this entity.
   * Prevents duplicate instance creation on retry.
   */
  hasActiveInstance(orgId: string, entityType: string, entityId: string): Promise<boolean>;
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
 *
 * Handles two distinct flows:
 * 1. entity_created → look up published definition → create new workflow instance
 * 2. All other events → resolve active token → advance existing instance
 */
export async function processOutboxEvent(
  event: OutboxEventRow,
  db: WorkerDbAdapter,
  handlers: NodeHandlerRegistry,
): Promise<void> {
  // Mark as processing
  await db.markOutboxProcessing(event.id, event.createdAt);

  try {
    if (event.eventType === 'entity_created') {
      await handleEntityCreated(event, db, handlers);
    } else {
      await handleAdvanceEvent(event, db, handlers);
    }

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
 * Handle entity_created events: look up published definition → create instance.
 *
 * PRD § Integration Points: "mutate() writes outbox event in same TX →
 * worker creates/advances instance."
 */
async function handleEntityCreated(
  event: OutboxEventRow,
  db: WorkerDbAdapter,
  handlers: NodeHandlerRegistry,
): Promise<void> {
  const entityType = event.payloadJson['entityType'] as string | undefined;
  const entityId = event.payloadJson['entityId'] as string | undefined;

  if (!entityType || !entityId) {
    // Malformed payload — nothing to do, mark completed
    return;
  }

  // Idempotency: check if an active instance already exists for this entity
  const alreadyExists = await db.hasActiveInstance(event.orgId, entityType, entityId);
  if (alreadyExists) {
    // Already has a running/paused instance — skip (idempotent)
    return;
  }

  // Look up the published effective definition for this entity type
  const definition = await db.lookupPublishedDefinition(event.orgId, entityType);
  if (!definition) {
    // No published workflow definition for this entity type — skip
    // This is normal for entity types without workflow (e.g., companies)
    return;
  }

  // Create a new workflow instance and advance through start node
  const actorUserId = (event.payloadJson['actorUserId'] as string) ?? 'system';

  await createInstance(
    {
      orgId: event.orgId,
      definitionId: definition.definitionId,
      definitionVersion: definition.definitionVersion,
      entityType,
      entityId,
      entityVersion: event.entityVersion,
      actorUserId,
      ...(event.traceId ? { traceId: event.traceId } : {}),
      contextJson: {
        entity: event.payloadJson['entitySnapshot'] ?? {},
      },
    },
    db,
    handlers,
  );
}

/**
 * Handle advance events: resolve active token → advance existing instance.
 */
async function handleAdvanceEvent(
  event: OutboxEventRow,
  db: WorkerDbAdapter,
  handlers: NodeHandlerRegistry,
): Promise<void> {
  // Resolve the active token for this instance
  const token = await db.resolveActiveToken(event.instanceId);
  if (!token) {
    // Instance has no active token — nothing to advance
    return;
  }

  // Advance the workflow
  await advanceWorkflow({
    instanceId: event.instanceId,
    completedNodeId: token.nodeId,
    tokenId: token.tokenId,
    entityVersion: token.entityVersion,
    actorUserId: 'system',
    ...(event.traceId ? { traceId: event.traceId } : {}),
    db,
    handlers,
  });
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
