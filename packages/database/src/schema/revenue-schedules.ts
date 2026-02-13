import { sql } from 'drizzle-orm';
import { bigint, check, date, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Revenue recognition schedules — deferred revenue amortization.
 *
 * PRD Phase E #21 + G0.19:
 * - Generated at invoice post or contract creation
 * - Modifications create new schedules, never edit history
 * - Each line represents one period's recognized revenue
 * - Append-only: schedules are evidence
 */
export const revenueSchedules = pgTable(
  'revenue_schedules',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    sourceType: text('source_type').notNull(),
    sourceId: uuid('source_id').notNull(),
    totalAmountMinor: bigint('total_amount_minor', { mode: 'number' }).notNull(),
    recognizedAmountMinor: bigint('recognized_amount_minor', { mode: 'number' }).notNull().default(0),
    deferredAmountMinor: bigint('deferred_amount_minor', { mode: 'number' }).notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    method: text('method').notNull().default('straight_line'),
    status: text('status').notNull().default('active'),
    revenueAccountId: uuid('revenue_account_id'),
    deferredAccountId: uuid('deferred_account_id'),
    memo: text('memo'),
  },
  (table) => [
    index('rev_sched_org_id_idx').on(table.orgId, table.id),
    index('rev_sched_company_idx').on(table.orgId, table.companyId),
    index('rev_sched_source_idx').on(table.orgId, table.sourceType, table.sourceId),
    check('rev_sched_org_not_empty', sql`org_id <> ''`),
    check('rev_sched_method_valid', sql`method IN ('straight_line', 'usage_based', 'milestone', 'manual')`),
    check('rev_sched_status_valid', sql`status IN ('active', 'completed', 'cancelled')`),
    check('rev_sched_date_order', sql`start_date <= end_date`),
    tenantPolicy(table),
  ],
);

export type RevenueSchedule = typeof revenueSchedules.$inferSelect;
export type NewRevenueSchedule = typeof revenueSchedules.$inferInsert;

/**
 * Revenue schedule lines — individual period recognition entries.
 */
export const revenueScheduleLines = pgTable(
  'revenue_schedule_lines',
  {
    ...baseEntityColumns,
    scheduleId: uuid('schedule_id').notNull(),
    fiscalPeriodId: uuid('fiscal_period_id'),
    periodDate: date('period_date').notNull(),
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    status: text('status').notNull().default('pending'),
    journalEntryId: uuid('journal_entry_id'),
    memo: text('memo'),
  },
  (table) => [
    index('rev_sched_lines_org_id_idx').on(table.orgId, table.id),
    index('rev_sched_lines_sched_idx').on(table.orgId, table.scheduleId),
    check('rev_sched_lines_org_not_empty', sql`org_id <> ''`),
    check('rev_sched_lines_status_valid', sql`status IN ('pending', 'recognized', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type RevenueScheduleLine = typeof revenueScheduleLines.$inferSelect;
export type NewRevenueScheduleLine = typeof revenueScheduleLines.$inferInsert;
