import { sql } from 'afenda-database';

import type { OutboxIntent } from 'afenda-canon';
import { stableHash } from '../util/stable-hash';

/**
 * Unified outbox writer — Phase 2 atomic replacement for:
 *   - services/search-outbox.ts      (enqueueSearchOutboxEvent)
 *   - services/workflow-outbox.ts    (enqueueWorkflowOutboxEvent)
 *
 * K-12: ALL writes come AFTER entity+audit+version writes and are inside
 * the SAME transaction. There is NO try/catch here. If a row write fails,
 * the entire TX rolls back — which is the correct, safe behaviour.
 *
 * Dedup: Each row includes an `intent_key` (stable hash). The DB enforces
 * UNIQUE(org_id, intent_key) so retried mutations do not produce duplicate
 * outbox rows. Requires the Phase 2 database migration (add intent_key
 * column + unique index to workflow_outbox / search_outbox).
 *
 * TODO (Phase 3): Replace raw SQL with Drizzle table references once the
 *   afenda-database schema exports the outbox tables.
 */
export async function writeOutboxIntents(
  tx: { execute: (q: ReturnType<typeof sql>) => Promise<unknown> },
  intents: OutboxIntent[],
  meta: { orgId: string; traceId: string },
): Promise<void> {
  for (const intent of intents) {
    // Stable dedup key: prevents duplicate rows on TX retry
    const intentKey = await buildIntentKey(intent);

    switch (intent.kind) {
      case 'workflow':
        await tx.execute(sql`
          INSERT INTO workflow_outbox (
            org_id, trace_id, intent_key,
            event, entity_type, entity_id, payload, status
          )
          VALUES (
            ${meta.orgId}, ${meta.traceId}, ${intentKey},
            ${intent.event}, ${intent.entityType}, ${intent.entityId},
            ${JSON.stringify(intent.payload)}::jsonb, 'pending'
          )
          ON CONFLICT (org_id, intent_key) DO NOTHING
        `);
        break;

      case 'search':
        await tx.execute(sql`
          INSERT INTO search_outbox (
            org_id, trace_id, intent_key,
            op, entity_type, entity_id, payload, status
          )
          VALUES (
            ${meta.orgId}, ${meta.traceId}, ${intentKey},
            ${intent.op}, ${intent.entityType}, ${intent.entityId},
            ${intent.payload ? JSON.stringify(intent.payload) : '{}'}::jsonb, 'pending'
          )
          ON CONFLICT (org_id, intent_key) DO NOTHING
        `);
        break;

      case 'webhook':
        await tx.execute(sql`
          INSERT INTO webhook_outbox (
            org_id, trace_id, intent_key,
            event, url_id, entity_type, entity_id, payload, status
          )
          VALUES (
            ${meta.orgId}, ${meta.traceId}, ${intentKey},
            ${intent.event}, ${intent.urlId}, ${intent.entityType}, ${intent.entityId},
            ${JSON.stringify(intent.payload)}::jsonb, 'pending'
          )
          ON CONFLICT (org_id, intent_key) DO NOTHING
        `);
        break;

      case 'integration':
        await tx.execute(sql`
          INSERT INTO integration_outbox (
            org_id, trace_id, intent_key,
            target, event, entity_type, entity_id, payload, status
          )
          VALUES (
            ${meta.orgId}, ${meta.traceId}, ${intentKey},
            ${intent.target}, ${intent.event}, ${intent.entityType}, ${intent.entityId},
            ${JSON.stringify(intent.payload)}::jsonb, 'pending'
          )
          ON CONFLICT (org_id, intent_key) DO NOTHING
        `);
        break;
    }
  }
}

/**
 * Build a deterministic dedup key for the intent.
 * Same intent (same kind + operation + entity + payload) = same key.
 */
async function buildIntentKey(intent: OutboxIntent): Promise<string> {
  const i = intent as any;
  let event: string;
  if ('event' in intent) {
    event = i.event as string;
  } else if ('op' in intent) {
    event = i.op as string;
  } else {
    event = i.target ?? i.kind ?? '';
  }
  const payloadStr = 'payload' in intent && i.payload
    ? JSON.stringify(i.payload, Object.keys(i.payload).sort())
    : '';

  return stableHash(i.kind, event, i.entityType, i.entityId, payloadStr);
}

/**
 * Helper: build OutboxIntents for the standard mutate() lifecycle.
 *
 * Covers the common case of a CRUD mutation that should trigger:
 *   1. A workflow event (if the entity has an active workflow)
 *   2. A search index upsert/delete
 *
 * Custom handlers can return additional intents from their planXxx() hooks.
 */
export function buildStandardIntents(params: {
  entityType: string;
  entityId: string;
  /** Full CRUD verb union — non-CRUD verbs (submit, approve, etc.) map to entity.updated/workflow.transitioned */
  verb: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  searchable?: boolean;
}): OutboxIntent[] {
  const intents: OutboxIntent[] = [];

  // Workflow intent
  const workflowEvent =
    params.verb === 'create' ? 'entity.created'
    : params.verb === 'delete' ? 'entity.deleted'
    : params.verb === 'restore' ? 'entity.restored'
    : (params.fromStatus !== params.toStatus && params.fromStatus != null && params.toStatus != null)
      ? 'workflow.transitioned'
      : 'entity.updated';

  intents.push({
    kind: 'workflow',
    event: workflowEvent,
    entityType: params.entityType,
    entityId: params.entityId,
    payload: {
      fromStatus: params.fromStatus ?? null,
      toStatus: params.toStatus ?? null,
    },
  });

  // Search intent (only for searchable entity types)
  if (params.searchable) {
    intents.push({
      kind: 'search',
      op: params.verb === 'delete' ? 'delete' : 'upsert',
      entityType: params.entityType,
      entityId: params.entityId,
    });
  }

  return intents;
}
