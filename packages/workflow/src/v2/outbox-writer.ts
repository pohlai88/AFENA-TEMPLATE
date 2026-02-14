import { computeEventIdempotencyKey } from './canonical-json';

import type { WorkflowDbAdapter } from './engine';

/**
 * Outbox event types — the set of events that mutate() can enqueue.
 */
export const OUTBOX_EVENT_TYPES = [
  'entity_created',
  'entity_updated',
  'entity_deleted',
  'entity_restored',
  'lifecycle_transition',
  'mutation_completed',
  'workflow_advance',
  'workflow_retry',
] as const;

export type OutboxEventType = (typeof OUTBOX_EVENT_TYPES)[number];

/**
 * Outbox write request — what mutate() passes to the outbox writer.
 */
export interface OutboxWriteRequest {
  orgId: string;
  instanceId: string;
  entityVersion: number;
  definitionVersion: number;
  eventType: OutboxEventType;
  payload: Record<string, unknown>;
  traceId?: string;
}

/**
 * Write a workflow event to the outbox within the same TX as mutate().
 *
 * PRD § Event Outbox Pattern:
 * ```
 * mutate() TX:
 *   ├── entity write
 *   ├── audit_log write
 *   ├── entity_version write
 *   └── workflow_events_outbox INSERT  ← same TX, guaranteed delivery
 * ```
 *
 * The outbox writer:
 * 1. Computes the event idempotency key (WF-11)
 * 2. Checks the outbox receipts table for duplicates
 * 3. Inserts the event into workflow_events_outbox
 * 4. Inserts the receipt into workflow_outbox_receipts
 *
 * All within the same DB transaction as the entity mutation.
 */
export async function writeEventToOutbox(
  request: OutboxWriteRequest,
  db: WorkflowDbAdapter,
): Promise<{ written: boolean; eventIdempotencyKey: string }> {
  const eventIdempotencyKey = computeEventIdempotencyKey(
    request.instanceId,
    request.eventType,
    request.payload,
    request.entityVersion,
  );

  // Check outbox receipt for dedup (WF-11)
  const receiptInserted = await db.insertOutboxReceipt(
    request.orgId,
    request.instanceId,
    'events',
    eventIdempotencyKey,
  );

  if (!receiptInserted) {
    // Duplicate — already enqueued
    return { written: false, eventIdempotencyKey };
  }

  // Insert event into outbox
  await db.insertEventOutbox({
    orgId: request.orgId,
    instanceId: request.instanceId,
    entityVersion: request.entityVersion,
    definitionVersion: request.definitionVersion,
    eventType: request.eventType,
    payloadJson: request.payload,
    eventIdempotencyKey,
    ...(request.traceId ? { traceId: request.traceId } : {}),
  });

  return { written: true, eventIdempotencyKey };
}

/**
 * Enqueue a workflow trigger event from mutate().
 *
 * Called after a successful entity mutation to trigger workflow advancement.
 * This is the bridge between the CRUD kernel and the workflow engine.
 */
export async function enqueueWorkflowTrigger(
  params: {
    orgId: string;
    instanceId: string;
    entityType: string;
    entityId: string;
    entityVersion: number;
    definitionVersion: number;
    actionType: string;
    fromStatus?: string;
    toStatus?: string;
    traceId?: string;
  },
  db: WorkflowDbAdapter,
): Promise<{ written: boolean; eventIdempotencyKey: string }> {
  // Determine event type from action
  const verb = params.actionType.split('.').pop() ?? '';
  let eventType: OutboxEventType;

  if (verb === 'create') {
    eventType = 'entity_created';
  } else if (verb === 'delete') {
    eventType = 'entity_deleted';
  } else if (verb === 'restore') {
    eventType = 'entity_restored';
  } else if (params.fromStatus && params.toStatus) {
    eventType = 'lifecycle_transition';
  } else {
    eventType = 'entity_updated';
  }

  return writeEventToOutbox(
    {
      orgId: params.orgId,
      instanceId: params.instanceId,
      entityVersion: params.entityVersion,
      definitionVersion: params.definitionVersion,
      eventType,
      payload: {
        entityType: params.entityType,
        entityId: params.entityId,
        actionType: params.actionType,
        fromStatus: params.fromStatus ?? null,
        toStatus: params.toStatus ?? null,
      },
      ...(params.traceId ? { traceId: params.traceId } : {}),
    },
    db,
  );
}
