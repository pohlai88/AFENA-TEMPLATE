import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { check, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Workflow V2 Side Effects Outbox — partitioned by created_at (monthly).
 *
 * Enqueue-only handlers (webhook_out, notification) write here.
 * IO worker polls with FOR UPDATE SKIP LOCKED → execute → evidence → DLQ.
 *
 * Composite PK: (created_at, id) — required by Postgres for partitioned tables.
 * Partitions managed by hand-written SQL in migration 0040.
 *
 * Triggers (from migration 0042):
 * - restrict_outbox_status_regression: allows failed→pending retry, dead_letter→pending admin override
 * 
 * GAP-DB-001: Composite PK (created_at, id) for partitioning (not org_id, id pattern).
 */
export const workflowSideEffectsOutbox = pgTable(
  'workflow_side_effects_outbox',
  {
    id: uuid('id').defaultRandom().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    orgId: text('org_id').notNull().default(sql`(auth.require_org_id())`),
    instanceId: uuid('instance_id').notNull(),
    stepExecutionId: uuid('step_execution_id').notNull(),
    effectType: text('effect_type').notNull(),
    payloadJson: jsonb('payload_json').notNull().default(sql`'{}'::jsonb`),
    eventIdempotencyKey: text('event_idempotency_key').notNull(),
    traceId: text('trace_id'),
    status: text('status').notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(5),
    nextRetryAt: timestamp('next_retry_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    error: text('error'),
    responseJson: jsonb('response_json'),
  },
  (table) => [
    // Constraints
    check('wf_se_org_not_empty', sql`org_id <> ''`),
    check('wf_se_status_valid', sql`status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter')`),
    check('wf_se_effect_type_valid', sql`effect_type IN ('webhook', 'email', 'sms', 'integration')`),

    // Indexes
    index('wf_se_org_instance_idx').on(table.orgId, table.instanceId),
    index('wf_se_org_step_idx').on(table.orgId, table.stepExecutionId),

    // RLS: SELECT + INSERT only
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type WorkflowSideEffectsOutboxRow = typeof workflowSideEffectsOutbox.$inferSelect;
export type NewWorkflowSideEffectsOutboxRow = typeof workflowSideEffectsOutbox.$inferInsert;
