/**
 * Close Tasks Table
 *
 * Checklist items for financial period-end close process.
 * Each task represents one step in the close checklist (e.g.,
 * "Run depreciation", "Post accruals", "Reconcile bank").
 * Tasks are dependency-ordered within a close cycle.
 * Financial Close spine table — Phase 3, step 13.
 */
import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const closeTasks = pgTable(
  'close_tasks',
  {
    ...docEntityColumns,

    /** FK to ledgers (which ledger is being closed) */
    ledgerId: uuid('ledger_id').notNull(),
    /** Fiscal year being closed */
    fiscalYear: text('fiscal_year').notNull(),
    /** Period number being closed */
    periodNumber: text('period_number').notNull(),
    /** Task code (e.g., 'RUN-DEPRECIATION', 'POST-ACCRUALS', 'RECONCILE-BANK') */
    taskCode: text('task_code').notNull(),
    /** Human-readable task name */
    name: text('name').notNull(),
    /** Task category: 'pre-close', 'close', 'post-close', 'review' */
    category: text('category').notNull().default('close'),
    /** Sequence order (lower = earlier) */
    sequenceOrder: integer('sequence_order').notNull().default(0),
    /** Task status: 'pending', 'in-progress', 'completed', 'skipped', 'blocked' */
    taskStatus: text('task_status').notNull().default('pending'),
    /** Who completed the task */
    completedBy: text('completed_by'),
    /** When the task was completed */
    completedAt: timestamp('completed_at', { withTimezone: true }),
    /** IDs of tasks that must be completed before this one (JSON array of task IDs) */
    dependsOn: jsonb('depends_on')
      .notNull()
      .default(sql`'[]'::jsonb`),
    /** Notes / comments from the closer */
    notes: text('notes'),
  },
  (table) => [
    tenantPk(table),
    index('ct_org_id_idx').on(table.orgId, table.id),
    index('ct_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by ledger + period
    index('ct_ledger_period_idx').on(
      table.orgId,
      table.ledgerId,
      table.fiscalYear,
      table.periodNumber,
    ),
    // Lookup by status (find pending tasks)
    index('ct_status_idx').on(table.orgId, table.taskStatus),
    // Execution order
    index('ct_sequence_idx').on(
      table.orgId,
      table.ledgerId,
      table.fiscalYear,
      table.periodNumber,
      table.sequenceOrder,
    ),
    check('ct_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('ct_valid_category', sql`category IN ('pre-close', 'close', 'post-close', 'review')`),
    check(
      'ct_valid_status',
      sql`task_status IN ('pending', 'in-progress', 'completed', 'skipped', 'blocked')`,
    ),

    tenantPolicy(table),
  ],
);

export type CloseTask = typeof closeTasks.$inferSelect;
export type NewCloseTask = typeof closeTasks.$inferInsert;
