/**
 * IO Worker — processes side-effect outbox events.
 *
 * PRD § WF-10:
 * > All cross-service side effects must be outbox-backed.
 * > Webhooks, email, 3rd-party sync, notifications — must write to
 * > workflow_side_effects_outbox first. IO worker executes and records evidence.
 *
 * Uses the same FOR UPDATE SKIP LOCKED pattern as the engine worker,
 * but processes workflow_side_effects_outbox instead of workflow_events_outbox.
 */

export interface SideEffectRow {
  id: string;
  createdAt: string;
  orgId: string;
  instanceId: string;
  stepExecutionId: string;
  effectType: string;
  payloadJson: Record<string, unknown>;
  eventIdempotencyKey: string;
  traceId: string | null;
  status: string;
  attempts: number;
  maxAttempts: number;
}

export interface IoWorkerDbAdapter {
  /**
   * Poll side-effect outbox for pending events.
   *
   * ```sql
   * SELECT * FROM workflow_side_effects_outbox
   * WHERE status IN ('pending', 'failed')
   *   AND (next_retry_at IS NULL OR next_retry_at <= now())
   *   AND attempts < max_attempts
   * ORDER BY created_at ASC
   * LIMIT :batchSize
   * FOR UPDATE SKIP LOCKED
   * ```
   */
  pollSideEffects(batchSize: number): Promise<SideEffectRow[]>;

  markSideEffectProcessing(id: string, createdAt: string): Promise<void>;
  markSideEffectCompleted(id: string, createdAt: string, responseJson: Record<string, unknown>): Promise<void>;
  markSideEffectFailed(id: string, createdAt: string, error: string, nextRetryAt: string | null): Promise<void>;
  markSideEffectDeadLetter(id: string, createdAt: string, error: string): Promise<void>;
}

/**
 * Side-effect executor interface — pluggable per effect type.
 */
export interface SideEffectExecutor {
  effectType: string;
  execute(payload: Record<string, unknown>, traceId: string | null): Promise<{
    success: boolean;
    responseJson: Record<string, unknown>;
    error?: string;
  }>;
}

export type SideEffectExecutorRegistry = Map<string, SideEffectExecutor>;

export interface IoWorkerConfig {
  batchSize: number;
  pollIntervalMs: number;
  retryBackoffMs: number;
  maxRetryBackoffMs: number;
  shutdownSignal?: AbortSignal;
}

const DEFAULT_CONFIG: IoWorkerConfig = {
  batchSize: 50,
  pollIntervalMs: 2000,
  retryBackoffMs: 5000,
  maxRetryBackoffMs: 300_000,
};

/**
 * Process a single side-effect event.
 */
export async function processSideEffect(
  event: SideEffectRow,
  db: IoWorkerDbAdapter,
  executors: SideEffectExecutorRegistry,
): Promise<void> {
  await db.markSideEffectProcessing(event.id, event.createdAt);

  const executor = executors.get(event.effectType);
  if (!executor) {
    await db.markSideEffectDeadLetter(
      event.id,
      event.createdAt,
      `No executor registered for effect type: ${event.effectType}`,
    );
    return;
  }

  try {
    const result = await executor.execute(event.payloadJson, event.traceId);

    if (result.success) {
      await db.markSideEffectCompleted(event.id, event.createdAt, result.responseJson);
    } else {
      const errorMsg = result.error ?? 'Side effect execution failed';

      if (event.attempts + 1 >= event.maxAttempts) {
        await db.markSideEffectDeadLetter(event.id, event.createdAt, errorMsg);
      } else {
        const backoffMs = Math.min(
          DEFAULT_CONFIG.retryBackoffMs * Math.pow(2, event.attempts),
          DEFAULT_CONFIG.maxRetryBackoffMs,
        );
        const nextRetryAt = new Date(Date.now() + backoffMs).toISOString();
        await db.markSideEffectFailed(event.id, event.createdAt, errorMsg, nextRetryAt);
      }
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    if (event.attempts + 1 >= event.maxAttempts) {
      await db.markSideEffectDeadLetter(event.id, event.createdAt, errorMessage);
    } else {
      const backoffMs = Math.min(
        DEFAULT_CONFIG.retryBackoffMs * Math.pow(2, event.attempts),
        DEFAULT_CONFIG.maxRetryBackoffMs,
      );
      const nextRetryAt = new Date(Date.now() + backoffMs).toISOString();
      await db.markSideEffectFailed(event.id, event.createdAt, errorMessage, nextRetryAt);
    }
  }
}

/**
 * Run a single poll cycle for side effects.
 */
export async function pollAndProcessSideEffects(
  db: IoWorkerDbAdapter,
  executors: SideEffectExecutorRegistry,
  batchSize: number = DEFAULT_CONFIG.batchSize,
): Promise<number> {
  const events = await db.pollSideEffects(batchSize);

  for (const event of events) {
    await processSideEffect(event, db, executors);
  }

  return events.length;
}

/**
 * Start the IO worker loop.
 */
export async function startIoWorkerLoop(
  db: IoWorkerDbAdapter,
  executors: SideEffectExecutorRegistry,
  config: Partial<IoWorkerConfig> = {},
): Promise<void> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  while (!cfg.shutdownSignal?.aborted) {
    const processed = await pollAndProcessSideEffects(db, executors, cfg.batchSize);

    if (processed === 0) {
      await sleep(cfg.pollIntervalMs, cfg.shutdownSignal);
    }
  }
}

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
