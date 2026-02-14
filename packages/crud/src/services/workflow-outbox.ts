import { sql } from 'afena-database';
import { computeEventIdempotencyKey } from 'afena-workflow';

/**
 * Enqueue a workflow trigger event inside the mutate() transaction.
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
 * This writes directly to the outbox tables using raw SQL within the
 * existing Drizzle transaction — no WorkflowDbAdapter needed.
 *
 * Steps:
 * 1. Find the active workflow instance for this entity
 * 2. Compute event idempotency key (WF-11)
 * 3. INSERT outbox receipt (dedup gate)
 * 4. INSERT outbox event row
 */
export async function enqueueWorkflowOutboxEvent(
  tx: any,
  params: {
    orgId: string;
    entityType: string;
    entityId: string;
    entityVersion: number;
    actionType: string;
    fromStatus?: string | null;
    toStatus?: string | null;
    traceId?: string;
  },
): Promise<{ written: boolean }> {
  // 1. Find active workflow instance for this entity
  const instanceRows = await tx.execute(sql`
    SELECT id, definition_version
    FROM workflow_instances
    WHERE entity_type = ${params.entityType}
      AND entity_id = ${params.entityId}::uuid
      AND status IN ('running', 'paused')
    LIMIT 1
  `);

  const instance = instanceRows.rows?.[0] as { id: string; definition_version: number } | undefined;
  if (!instance) {
    // No active workflow instance — nothing to enqueue
    return { written: false };
  }

  // Determine event type from action verb
  const verb = params.actionType.split('.').pop() ?? '';
  let eventType: string;
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

  const payload = {
    entityType: params.entityType,
    entityId: params.entityId,
    actionType: params.actionType,
    fromStatus: params.fromStatus ?? null,
    toStatus: params.toStatus ?? null,
  };

  // 2. Compute idempotency key (WF-11)
  const eventIdempotencyKey = computeEventIdempotencyKey(
    instance.id,
    eventType,
    payload,
    params.entityVersion,
  );

  // 3. INSERT outbox receipt (dedup gate — ON CONFLICT DO NOTHING)
  const receiptResult = await tx.execute(sql`
    INSERT INTO workflow_outbox_receipts (org_id, instance_id, source_table, event_idempotency_key)
    VALUES (${params.orgId}, ${instance.id}::uuid, 'events', ${eventIdempotencyKey})
    ON CONFLICT DO NOTHING
    RETURNING org_id
  `);

  if (!receiptResult.rows || receiptResult.rows.length === 0) {
    // Duplicate — already enqueued
    return { written: false };
  }

  // 4. INSERT outbox event row
  await tx.execute(sql`
    INSERT INTO workflow_events_outbox (
      org_id, instance_id, entity_version, definition_version,
      event_type, payload_json, event_idempotency_key, trace_id, status
    ) VALUES (
      ${params.orgId},
      ${instance.id}::uuid,
      ${params.entityVersion},
      ${instance.definition_version},
      ${eventType},
      ${JSON.stringify(payload)}::jsonb,
      ${eventIdempotencyKey},
      ${params.traceId ?? null},
      'pending'
    )
  `);

  return { written: true };
}
