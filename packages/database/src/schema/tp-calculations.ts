/**
 * Transfer Pricing Calculations Table
 *
 * Records of TP calculations performed against policies.
 * Each row captures the PLI computation, benchmarking result,
 * and arm's-length validation for an intercompany transaction set.
 * Transfer Pricing spine table — Phase 3, step 15.
 */
import { sql } from 'drizzle-orm';
import {
  bigint,
  check,
  date,
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const tpCalculations = pgTable(
  'tp_calculations',
  {
    ...erpEntityColumns,

    /** FK to tp_policies */
    policyId: uuid('policy_id').notNull(),
    /** Fiscal year of the calculation */
    fiscalYear: text('fiscal_year').notNull(),
    /** Calculation date */
    calculationDate: date('calculation_date').notNull(),
    /** The TP method applied */
    appliedMethod: text('applied_method').notNull(),
    /** Transaction value in minor units */
    transactionValueMinor: bigint('transaction_value_minor', { mode: 'number' })
      .notNull()
      .default(0),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Calculated PLI value (e.g., operating margin, markup %) */
    pliValue: numeric('pli_value', { precision: 18, scale: 6 }),
    /** Arm's-length range low bound */
    rangeLow: numeric('range_low', { precision: 18, scale: 6 }),
    /** Arm's-length range median */
    rangeMedian: numeric('range_median', { precision: 18, scale: 6 }),
    /** Arm's-length range high bound */
    rangeHigh: numeric('range_high', { precision: 18, scale: 6 }),
    /** Result: 'within-range', 'below-range', 'above-range' */
    result: text('result').notNull(),
    /** Adjustment required in minor units (0 if within range) */
    adjustmentMinor: bigint('adjustment_minor', { mode: 'number' }).notNull().default(0),
    /** Detailed calculation breakdown (JSON) */
    calculationDetails: jsonb('calculation_details')
      .notNull()
      .default(sql`'{}'::jsonb`),
    /** Notes / methodology description */
    notes: text('notes'),
  },
  (table) => [
    tenantPk(table),
    index('tpc_org_id_idx').on(table.orgId, table.id),
    index('tpc_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by policy + year
    index('tpc_policy_year_idx').on(table.orgId, table.policyId, table.fiscalYear),
    // Lookup by result (find out-of-range items)
    index('tpc_result_idx').on(table.orgId, table.result),
    check('tpc_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('tpc_valid_result', sql`result IN ('within-range', 'below-range', 'above-range')`),

    tenantPolicy(table),
  ],
);

export type TpCalculation = typeof tpCalculations.$inferSelect;
export type NewTpCalculation = typeof tpCalculations.$inferInsert;
