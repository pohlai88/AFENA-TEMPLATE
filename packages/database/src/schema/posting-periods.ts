/**
 * Posting Periods Table
 *
 * Period status per (company, ledger, period) controlling which periods
 * are open for posting. Statuses: open, soft-close, hard-close.
 * GL Platform spine table — Phase 3, step 11.
 *
 * Unlike fiscal_periods (which defines date ranges), posting_periods
 * tracks the posting status per ledger, allowing different ledgers
 * to close independently.
 */
import { sql } from 'drizzle-orm';
import {
  check,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const postingPeriods = pgTable(
  'posting_periods',
  {
    ...erpEntityColumns,

    /** FK to ledgers table */
    ledgerId: uuid('ledger_id').notNull(),
    /** Fiscal year (e.g., '2025') */
    fiscalYear: text('fiscal_year').notNull(),
    /** Period number within the year (e.g., '01' - '12', '13' for adjustments) */
    periodNumber: text('period_number').notNull(),
    /** Period start date */
    startDate: date('start_date').notNull(),
    /** Period end date (inclusive) */
    endDate: date('end_date').notNull(),
    /** Posting status: 'open', 'soft-close', 'hard-close' */
    status: text('status').notNull().default('open'),
    /** Who soft-closed this period */
    softClosedBy: text('soft_closed_by'),
    /** When soft-closed */
    softClosedAt: timestamp('soft_closed_at', { withTimezone: true }),
    /** Who hard-closed this period */
    hardClosedBy: text('hard_closed_by'),
    /** When hard-closed */
    hardClosedAt: timestamp('hard_closed_at', { withTimezone: true }),
  },
  (table) => [
    tenantPk(table),
    index('pp_org_id_idx').on(table.orgId, table.id),
    index('pp_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by ledger + year + period
    index('pp_ledger_period_idx').on(
      table.orgId,
      table.ledgerId,
      table.fiscalYear,
      table.periodNumber,
    ),
    // Lookup by company + status (find all open periods)
    index('pp_company_status_idx').on(table.orgId, table.companyId, table.status),
    // Unique: one row per (org, ledger, year, period)
    uniqueIndex('pp_unique_period_idx').on(
      table.orgId,
      table.ledgerId,
      table.fiscalYear,
      table.periodNumber,
    ),
    check('pp_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('pp_valid_status', sql`status IN ('open', 'soft-close', 'hard-close')`),
    check('pp_valid_dates', sql`end_date >= start_date`),

    tenantPolicy(table),
  ],
);

export type PostingPeriod = typeof postingPeriods.$inferSelect;
export type NewPostingPeriod = typeof postingPeriods.$inferInsert;
