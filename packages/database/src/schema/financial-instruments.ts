/**
 * Financial Instruments Table
 *
 * IFRS 9 classification and measurement of financial instruments.
 * Supports the three measurement categories: amortised cost,
 * FVOCI (fair value through OCI), and FVTPL (fair value through P&L).
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

export const financialInstruments = pgTable(
  'financial_instruments',
  {
    ...erpEntityColumns,

    /** Instrument reference number */
    instrumentNo: text('instrument_no').notNull(),
    /** Human-readable name / description */
    name: text('name').notNull(),
    /** Instrument type: 'debt', 'equity', 'derivative', 'loan-receivable', 'loan-payable', 'trade-receivable' */
    instrumentType: text('instrument_type').notNull(),
    /** IFRS 9 classification: 'amortised-cost', 'fvoci', 'fvtpl' */
    classification: text('classification').notNull(),
    /** Business model: 'hold-to-collect', 'hold-to-collect-and-sell', 'other' */
    businessModel: text('business_model').notNull(),
    /** Whether SPPI (Solely Payments of Principal and Interest) test is met */
    sppiTestResult: text('sppi_test_result'),
    /** Counterparty ID */
    counterpartyId: uuid('counterparty_id'),
    /** Face / notional value in minor units */
    faceValueMinor: bigint('face_value_minor', { mode: 'number' }).notNull(),
    /** Current carrying amount in minor units */
    carryingAmountMinor: bigint('carrying_amount_minor', { mode: 'number' }).notNull(),
    /** Fair value in minor units */
    fairValueMinor: bigint('fair_value_minor', { mode: 'number' }),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Effective interest rate */
    effectiveInterestRate: numeric('effective_interest_rate', { precision: 12, scale: 8 }),
    /** Coupon / stated interest rate */
    statedRate: numeric('stated_rate', { precision: 12, scale: 8 }),
    /** Origination / acquisition date */
    originationDate: date('origination_date').notNull(),
    /** Maturity date (null for equity / perpetual) */
    maturityDate: date('maturity_date'),
    /** ECL staging: 'stage-1', 'stage-2', 'stage-3' */
    eclStage: text('ecl_stage').default('stage-1'),
    /** Expected credit loss amount in minor units */
    eclAmountMinor: bigint('ecl_amount_minor', { mode: 'number' }).notNull().default(0),
    /** Fair value hierarchy: 'level-1', 'level-2', 'level-3' */
    fairValueLevel: text('fair_value_level'),
    /** Additional details (JSONB) */
    instrumentDetails: jsonb('instrument_details')
      .notNull()
      .default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('fi_org_id_idx').on(table.orgId, table.id),
    index('fi_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by classification
    index('fi_classification_idx').on(table.orgId, table.classification),
    // Lookup by ECL stage
    index('fi_ecl_stage_idx').on(table.orgId, table.eclStage),
    // Lookup by counterparty
    index('fi_counterparty_idx').on(table.orgId, table.counterpartyId),
    // Lookup by company + type
    index('fi_company_type_idx').on(table.orgId, table.companyId, table.instrumentType),
    check('fi_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('fi_valid_classification', sql`classification IN ('amortised-cost', 'fvoci', 'fvtpl')`),
    check(
      'fi_valid_business_model',
      sql`business_model IN ('hold-to-collect', 'hold-to-collect-and-sell', 'other')`,
    ),
    check(
      'fi_valid_ecl_stage',
      sql`ecl_stage IS NULL OR ecl_stage IN ('stage-1', 'stage-2', 'stage-3')`,
    ),
    check(
      'fi_valid_fv_level',
      sql`fair_value_level IS NULL OR fair_value_level IN ('level-1', 'level-2', 'level-3')`,
    ),

    tenantPolicy(table),
  ],
);

export type FinancialInstrument = typeof financialInstruments.$inferSelect;
export type NewFinancialInstrument = typeof financialInstruments.$inferInsert;
