/**
 * Hedge Effectiveness Tests Table
 *
 * IFRS 9 section 6 hedge effectiveness test results.
 * Records prospective and retrospective effectiveness assessments
 * using dollar-offset, regression, or other methods.
 * IFRS P2 table — Phase 3, step 16.
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

export const hedgeEffectivenessTests = pgTable(
  'hedge_effectiveness_tests',
  {
    ...erpEntityColumns,

    /** FK to hedge_designations */
    designationId: uuid('designation_id').notNull(),
    /** Test type: 'prospective', 'retrospective' */
    testType: text('test_type').notNull(),
    /** Test method: 'dollar-offset', 'regression', 'var-reduction', 'critical-terms', 'other' */
    testMethod: text('test_method').notNull(),
    /** Test date */
    testDate: date('test_date').notNull(),
    /** Fiscal period this test covers */
    periodKey: text('period_key'),
    /** Change in fair value of hedging instrument in minor units */
    instrumentFvChangeMinor: bigint('instrument_fv_change_minor', { mode: 'number' }).notNull(),
    /** Change in fair value of hedged item in minor units */
    hedgedItemFvChangeMinor: bigint('hedged_item_fv_change_minor', { mode: 'number' }).notNull(),
    /** Effectiveness ratio (instrument delta / hedged item delta) */
    effectivenessRatio: numeric('effectiveness_ratio', { precision: 12, scale: 6 }),
    /** Result: 'effective', 'ineffective' */
    result: text('result').notNull(),
    /** Ineffective portion in minor units (to be recognized in P&L) */
    ineffectivePortionMinor: bigint('ineffective_portion_minor', { mode: 'number' })
      .notNull()
      .default(0),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Detailed test data (JSON: regression stats, assumptions) */
    testDetails: jsonb('test_details')
      .notNull()
      .default(sql`'{}'::jsonb`),
    /** Notes / methodology description */
    notes: text('notes'),
  },
  (table) => [
    tenantPk(table),
    index('het_org_id_idx').on(table.orgId, table.id),
    index('het_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by designation
    index('het_designation_idx').on(table.orgId, table.designationId),
    // Lookup by date range
    index('het_date_idx').on(table.orgId, table.testDate),
    // Lookup by result (find ineffective hedges)
    index('het_result_idx').on(table.orgId, table.result),
    check('het_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('het_valid_test_type', sql`test_type IN ('prospective', 'retrospective')`),
    check(
      'het_valid_method',
      sql`test_method IN ('dollar-offset', 'regression', 'var-reduction', 'critical-terms', 'other')`,
    ),
    check('het_valid_result', sql`result IN ('effective', 'ineffective')`),

    tenantPolicy(table),
  ],
);

export type HedgeEffectivenessTest = typeof hedgeEffectivenessTests.$inferSelect;
export type NewHedgeEffectivenessTest = typeof hedgeEffectivenessTests.$inferInsert;
