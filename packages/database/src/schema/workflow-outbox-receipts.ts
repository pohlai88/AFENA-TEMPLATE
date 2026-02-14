import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { check, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Workflow V2 Outbox Receipts — non-partitioned, global dedup (WF-11).
 *
 * Composite PK: (org_id, instance_id, source_table, event_idempotency_key).
 * Prevents duplicate outbox event writes across partitions.
 * source_table discriminates between 'events' and 'side_effects'.
 *
 * Append-only: REVOKE UPDATE, DELETE from authenticated role.
 * Pruned by receipts-pruner job for completed instances > N days.
 */
export const workflowOutboxReceipts = pgTable(
  'workflow_outbox_receipts',
  {
    orgId: text('org_id').notNull().default(sql`(auth.require_org_id())`),
    instanceId: uuid('instance_id').notNull(),
    sourceTable: text('source_table').notNull(),
    eventIdempotencyKey: text('event_idempotency_key').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Constraints
    check('wf_or_org_not_empty', sql`org_id <> ''`),
    check('wf_or_source_valid', sql`source_table IN ('events', 'side_effects')`),

    // RLS: SELECT + INSERT only (UPDATE/DELETE revoked post-migration)
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type WorkflowOutboxReceiptRow = typeof workflowOutboxReceipts.$inferSelect;
export type NewWorkflowOutboxReceiptRow = typeof workflowOutboxReceipts.$inferInsert;
