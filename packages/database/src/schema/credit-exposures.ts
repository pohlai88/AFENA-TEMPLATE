/**
 * Credit Exposures Table
 *
 * Point-in-time snapshots of credit exposure per customer.
 * Used for ECL (Expected Credit Loss) calculations and
 * credit risk monitoring.
 * Missing sub-ledger table — Phase 3, step 17.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, date, index, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const creditExposures = pgTable(
  'credit_exposures',
  {
    ...erpEntityColumns,

    /** FK to customers / contacts */
    customerId: uuid('customer_id').notNull(),
    /** Snapshot date */
    snapshotDate: date('snapshot_date').notNull(),
    /** Total outstanding in minor units */
    totalOutstandingMinor: bigint('total_outstanding_minor', { mode: 'number' }).notNull(),
    /** Overdue amount in minor units */
    overdueAmountMinor: bigint('overdue_amount_minor', { mode: 'number' }).notNull().default(0),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Aging bucket breakdown (JSON: { current, 30d, 60d, 90d, 120d, over120d }) */
    agingBuckets: jsonb('aging_buckets')
      .notNull()
      .default(sql`'{}'::jsonb`),
    /** ECL stage: 'stage-1', 'stage-2', 'stage-3' (IFRS 9) */
    eclStage: text('ecl_stage').notNull().default('stage-1'),
    /** ECL amount in minor units */
    eclAmountMinor: bigint('ecl_amount_minor', { mode: 'number' }).notNull().default(0),
    /** Probability of default */
    probabilityOfDefault: text('probability_of_default'),
    /** Loss given default */
    lossGivenDefault: text('loss_given_default'),
  },
  (table) => [
    tenantPk(table),
    index('ce_org_id_idx').on(table.orgId, table.id),
    index('ce_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by customer + date
    index('ce_customer_date_idx').on(table.orgId, table.customerId, table.snapshotDate),
    // Lookup by ECL stage
    index('ce_ecl_stage_idx').on(table.orgId, table.eclStage),
    check('ce_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('ce_valid_ecl_stage', sql`ecl_stage IN ('stage-1', 'stage-2', 'stage-3')`),

    tenantPolicy(table),
  ],
);

export type CreditExposure = typeof creditExposures.$inferSelect;
export type NewCreditExposure = typeof creditExposures.$inferInsert;
