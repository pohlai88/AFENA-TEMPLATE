import type { WorkflowDbAdapter } from './engine';

/**
 * Resume scheduler — scans for due wait_timer / wait_event steps
 * and writes outbox events to advance the workflow.
 *
 * PRD § Wait States:
 * > The resume scheduler scans for due wait_timer steps (resume_at <= now())
 * > and wait_event steps matched by incoming events.
 * > It writes workflow_events_outbox rows to trigger advanceWorkflow().
 *
 * Designed to run as a periodic background job (pg_cron or Graphile Worker).
 */

export interface ResumeSchedulerDbAdapter extends WorkflowDbAdapter {
  /**
   * Find wait_timer steps that are due for resume.
   *
   * ```sql
   * SELECT se.id, se.created_at, se.instance_id, se.node_id, se.token_id,
   *        se.entity_version, wi.org_id, wi.definition_version
   * FROM workflow_step_executions se
   * JOIN workflow_instances wi ON wi.id = se.instance_id
   * WHERE se.node_type = 'wait_timer'
   *   AND se.status = 'pending'
   *   AND se.resume_at <= now()
   *   AND wi.status IN ('running', 'paused')
   * ORDER BY se.resume_at ASC
   * LIMIT :batchSize
   * FOR UPDATE OF se SKIP LOCKED
   * ```
   */
  findDueTimerSteps(batchSize: number): Promise<DueStep[]>;

  /**
   * Find wait_event steps matching a specific event key.
   *
   * ```sql
   * SELECT se.id, se.created_at, se.instance_id, se.node_id, se.token_id,
   *        se.entity_version, wi.org_id, wi.definition_version
   * FROM workflow_step_executions se
   * JOIN workflow_instances wi ON wi.id = se.instance_id
   * WHERE se.node_type = 'wait_event'
   *   AND se.status = 'pending'
   *   AND se.waiting_for_event_key = :eventKey
   *   AND wi.status IN ('running', 'paused')
   * LIMIT 1
   * FOR UPDATE OF se SKIP LOCKED
   * ```
   */
  findWaitingEventStep(eventKey: string): Promise<DueStep | null>;

  /** Mark a step as resumed (status → 'running') */
  markStepResumed(stepId: string, createdAt: string): Promise<void>;
}

export interface DueStep {
  stepId: string;
  createdAt: string;
  instanceId: string;
  nodeId: string;
  tokenId: string;
  entityVersion: number;
  orgId: string;
  definitionVersion: number;
}

export interface ResumeSchedulerConfig {
  batchSize: number;
  pollIntervalMs: number;
  shutdownSignal?: AbortSignal;
}

const DEFAULT_CONFIG: ResumeSchedulerConfig = {
  batchSize: 50,
  pollIntervalMs: 5000,
};

/**
 * Process due timer steps — find steps with resume_at <= now() and enqueue advance events.
 */
export async function processDueTimers(
  db: ResumeSchedulerDbAdapter,
  batchSize: number = DEFAULT_CONFIG.batchSize,
): Promise<number> {
  const dueSteps = await db.findDueTimerSteps(batchSize);

  for (const step of dueSteps) {
    await db.markStepResumed(step.stepId, step.createdAt);

    await db.insertEventOutbox({
      orgId: step.orgId,
      instanceId: step.instanceId,
      entityVersion: step.entityVersion,
      definitionVersion: step.definitionVersion,
      eventType: 'workflow_advance',
      payloadJson: {
        reason: 'timer_resume',
        nodeId: step.nodeId,
        tokenId: step.tokenId,
        stepId: step.stepId,
      },
      eventIdempotencyKey: `timer:${step.stepId}:${step.createdAt}`,
    });
  }

  return dueSteps.length;
}

/**
 * Resume a wait_event step by event key — called when an external event arrives.
 */
export async function resumeByEventKey(
  db: ResumeSchedulerDbAdapter,
  eventKey: string,
  eventPayload: Record<string, unknown> = {},
): Promise<{ resumed: boolean; instanceId?: string }> {
  const step = await db.findWaitingEventStep(eventKey);
  if (!step) {
    return { resumed: false };
  }

  await db.markStepResumed(step.stepId, step.createdAt);

  await db.insertEventOutbox({
    orgId: step.orgId,
    instanceId: step.instanceId,
    entityVersion: step.entityVersion,
    definitionVersion: step.definitionVersion,
    eventType: 'workflow_advance',
    payloadJson: {
      reason: 'event_resume',
      eventKey,
      eventPayload,
      nodeId: step.nodeId,
      tokenId: step.tokenId,
      stepId: step.stepId,
    },
    eventIdempotencyKey: `event:${step.stepId}:${eventKey}`,
  });

  return { resumed: true, instanceId: step.instanceId };
}

/**
 * Start the resume scheduler loop.
 * Polls for due timer steps at a fixed interval.
 */
export async function startResumeSchedulerLoop(
  db: ResumeSchedulerDbAdapter,
  config: Partial<ResumeSchedulerConfig> = {},
): Promise<void> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  while (!cfg.shutdownSignal?.aborted) {
    await processDueTimers(db, cfg.batchSize);

    await sleep(cfg.pollIntervalMs, cfg.shutdownSignal);
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
