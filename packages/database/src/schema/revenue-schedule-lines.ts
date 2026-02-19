/**
 * Revenue Schedule Lines Table
 *
 * Individual recognition entries for a revenue schedule.
 * One line per fiscal period with amount to recognize.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const revenueScheduleLines = pgTable(
  'revenue_schedule_lines',
  {
    ...erpEntityColumns,

    /** Reference to parent revenue schedule */
    scheduleId: uuid('schedule_id').notNull(),
    /** Reference to fiscal period for this recognition */
    fiscalPeriodId: uuid('fiscal_period_id').notNull(),
    /** Amount to recognize in this period (in minor units) */
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    /** Cumulative amount recognized up to and including this period */
    cumulativeAmountMinor: bigint('cumulative_amount_minor', { mode: 'number' }).notNull(),
    /** Line status: 'scheduled', 'recognized', 'reversed', 'skipped' */
    status: text('status').notNull().default('scheduled'),
    /** When recognition was posted */
    recognizedAt: timestamp('recognized_at', { withTimezone: true }),
    /** Reference to journal entry for this recognition */
    journalEntryId: uuid('journal_entry_id'),
    /** User who posted the recognition */
    recognizedBy: uuid('recognized_by'),
  },
  (table) => [
    tenantPk(table),
    index('revenue_schedule_lines_org_id_idx').on(table.orgId, table.id),
    index('revenue_schedule_lines_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by schedule
    index('revenue_schedule_lines_schedule_idx').on(table.orgId, table.scheduleId),
    // Lookup by fiscal period
    index('revenue_schedule_lines_period_idx').on(table.orgId, table.fiscalPeriodId),
    // Unique: one line per schedule per period
    uniqueIndex('revenue_schedule_lines_unique_idx').on(table.orgId, table.scheduleId, table.fiscalPeriodId),
    check('revenue_schedule_lines_org_not_empty', sql`org_id <> ''`),

    tenantPolicy(table),
  ],
);

export type RevenueScheduleLine = typeof revenueScheduleLines.$inferSelect;
export type NewRevenueScheduleLine = typeof revenueScheduleLines.$inferInsert;
