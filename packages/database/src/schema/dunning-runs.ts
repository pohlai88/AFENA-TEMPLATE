/**
 * Dunning Runs Table
 *
 * A batch process that scans overdue receivables and generates
 * dunning notices. Uses docEntityColumns for submit/cancel lifecycle.
 *
 * ERPNext equivalent: "Dunning" (header portion).
 */
import { sql } from 'drizzle-orm';
import { check, date, index, integer, pgTable, text } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const dunningRuns = pgTable(
  'dunning_runs',
  {
    ...docEntityColumns,

    /** Human-readable run identifier (allocated on submit) */
    runNo: text('run_no'),
    /** Date the dunning run was executed */
    runDate: date('run_date').notNull(),
    /** Invoices overdue as of this date are included */
    cutoffDate: date('cutoff_date').notNull(),
    /** Count of notices generated */
    noticeCount: integer('notice_count').notNull().default(0),
    /** Sum of outstanding amounts across all notices */
    totalOutstandingMinor: moneyMinor('total_outstanding_minor'),
    /** Currency of the aggregated amounts */
    currencyCode: currencyCodeStrict('currency_code'),
    /** Run lifecycle: draft → processing → completed | cancelled */
    status: text('status').notNull().default('draft'),
  },
  (t) => [
    ...erpIndexes('dunning_runs', t),

    index('idx__dunning_runs__run_date').on(t.orgId, t.runDate),

    check(
      'dunning_runs_valid_status',
      sql`status IN ('draft', 'processing', 'completed', 'cancelled')`,
    ),
    check('dunning_runs_nonneg_count', sql`notice_count >= 0`),
  ],
);

export type DunningRun = typeof dunningRuns.$inferSelect;
export type NewDunningRun = typeof dunningRuns.$inferInsert;
