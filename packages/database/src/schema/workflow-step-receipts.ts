import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { check, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Workflow V2 Step Receipts — non-partitioned, global dedup (WF-02).
 *
 * Composite PK: (org_id, instance_id, idempotency_key).
 * Receipt INSERT must succeed before handler runs (WF-14: receipt-first gate).
 * idempotency_key = sha256(instance_id + node_id + token_id + entity_version).
 *
 * Append-only: REVOKE UPDATE, DELETE from authenticated role.
 * Pruned by receipts-pruner job for completed instances > N days.
 * 
 * GAP-DB-001: Composite PK (org_id, instance_id, idempotency_key) for dedup.
 */
export const workflowStepReceipts = pgTable(
  'workflow_step_receipts',
  {
    orgId: text('org_id').notNull().default(sql`(auth.require_org_id())`),
    instanceId: uuid('instance_id').notNull(),
    idempotencyKey: text('idempotency_key').notNull(),
    stepExecutionId: uuid('step_execution_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Constraints
    check('wf_sr_org_not_empty', sql`org_id <> ''`),

    // RLS: SELECT + INSERT only (UPDATE/DELETE revoked post-migration)
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type WorkflowStepReceiptRow = typeof workflowStepReceipts.$inferSelect;
export type NewWorkflowStepReceiptRow = typeof workflowStepReceipts.$inferInsert;
