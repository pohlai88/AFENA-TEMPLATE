import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { check, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Workflow V2 Events Outbox — partitioned by created_at (monthly).
 *
 * Transactional outbox: written in same TX as mutation (WF-11).
 * Worker polls with FOR UPDATE SKIP LOCKED → advance → complete/fail/DLQ.
 *
 * Composite PK: (created_at, id) — required by Postgres for partitioned tables.
 * Partitions managed by hand-written SQL in migration 0040.
 *
 * Triggers (from migration 0042):
 * - restrict_outbox_status_regression: allows failed→pending retry, dead_letter→pending admin override
 */
export const workflowEventsOutbox = pgTable(
  'workflow_events_outbox',
  {
    id: uuid('id').defaultRandom().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    orgId: text('org_id').notNull().default(sql`(auth.require_org_id())`),
    instanceId: uuid('instance_id').notNull(),
    entityVersion: integer('entity_version').notNull(),
    definitionVersion: integer('definition_version'),
    eventType: text('event_type').notNull(),
    payloadJson: jsonb('payload_json').notNull().default(sql`'{}'::jsonb`),
    eventIdempotencyKey: text('event_idempotency_key').notNull(),
    traceId: text('trace_id'),
    status: text('status').notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(5),
    nextRetryAt: timestamp('next_retry_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    error: text('error'),
  },
  (table) => [
    // Constraints
    check('wf_evt_org_not_empty', sql`org_id <> ''`),
    check('wf_evt_status_valid', sql`status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter')`),

    // Indexes
    index('wf_evt_org_instance_idx').on(table.orgId, table.instanceId),

    // RLS: SELECT + INSERT only
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type WorkflowEventsOutboxRow = typeof workflowEventsOutbox.$inferSelect;
export type NewWorkflowEventsOutboxRow = typeof workflowEventsOutbox.$inferInsert;
