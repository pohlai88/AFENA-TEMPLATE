/**
 * Intangible Assets Table
 *
 * IAS 38 intangible asset register. Tracks internally-generated
 * and acquired intangible assets with amortization schedules,
 * impairment testing, and R&D capitalization criteria.
 * IFRS P2 table — Phase 3, step 16.
 */
import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
} from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const intangibleAssets = pgTable(
  'intangible_assets',
  {
    ...erpEntityColumns,

    /** Asset number */
    assetNumber: text('asset_number').notNull(),
    /** Human-readable name */
    name: text('name').notNull(),
    /** Asset category: 'software', 'patent', 'trademark', 'license', 'goodwill', 'development', 'other' */
    category: text('category').notNull(),
    /** Measurement model: 'cost', 'revaluation' */
    measurementModel: text('measurement_model').notNull().default('cost'),
    /** Useful life type: 'finite', 'indefinite' */
    usefulLifeType: text('useful_life_type').notNull().default('finite'),
    /** Useful life in months (null for indefinite) */
    usefulLifeMonths: integer('useful_life_months'),
    /** Amortization method: 'straight-line', 'units-of-production', 'reducing-balance' */
    amortizationMethod: text('amortization_method').default('straight-line'),
    /** Acquisition date */
    acquisitionDate: date('acquisition_date').notNull(),
    /** Acquisition cost in minor units */
    acquisitionCostMinor: bigint('acquisition_cost_minor', { mode: 'number' }).notNull(),
    /** Accumulated amortization in minor units */
    accumulatedAmortizationMinor: bigint('accumulated_amortization_minor', { mode: 'number' })
      .notNull()
      .default(0),
    /** Accumulated impairment in minor units */
    accumulatedImpairmentMinor: bigint('accumulated_impairment_minor', { mode: 'number' })
      .notNull()
      .default(0),
    /** Carrying amount in minor units (derived: cost - amort - impairment) */
    carryingAmountMinor: bigint('carrying_amount_minor', { mode: 'number' }).notNull(),
    /** Residual value in minor units */
    residualValueMinor: bigint('residual_value_minor', { mode: 'number' }).notNull().default(0),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Fair value (for revaluation model) */
    fairValue: numeric('fair_value', { precision: 18, scale: 2 }),
    /** Whether R&D capitalization criteria were met (IAS 38.57) */
    rdCapitalizationMet: boolean('rd_capitalization_met'),
    /** Additional details (JSONB) */
    assetDetails: jsonb('asset_details')
      .notNull()
      .default(sql`'{}'::jsonb`),
    /** Whether this asset is active */
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    tenantPk(table),
    index('ia_org_id_idx').on(table.orgId, table.id),
    index('ia_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by company + category
    index('ia_company_category_idx').on(table.orgId, table.companyId, table.category),
    // Lookup by useful life type (find indefinite-life assets for impairment testing)
    index('ia_life_type_idx').on(table.orgId, table.usefulLifeType),
    check('ia_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'ia_valid_category',
      sql`category IN ('software', 'patent', 'trademark', 'license', 'goodwill', 'development', 'other')`,
    ),
    check('ia_valid_model', sql`measurement_model IN ('cost', 'revaluation')`),
    check('ia_valid_life_type', sql`useful_life_type IN ('finite', 'indefinite')`),

    tenantPolicy(table),
  ],
);

export type IntangibleAsset = typeof intangibleAssets.$inferSelect;
export type NewIntangibleAsset = typeof intangibleAssets.$inferInsert;
