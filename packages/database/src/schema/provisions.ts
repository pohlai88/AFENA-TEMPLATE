/**
 * Provisions Table
 *
 * IAS 37 provision register. Tracks recognized provisions
 * (legal, constructive, onerous contracts) with best-estimate
 * measurement and discount unwinding.
 * IFRS P2 table — Phase 3, step 16.
 */
import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  date,
  index,
  numeric,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const provisions = pgTable(
  'provisions',
  {
    ...erpEntityColumns,

    /** Provision reference number */
    provisionNo: text('provision_no').notNull(),
    /** Human-readable name */
    name: text('name').notNull(),
    /** Provision type: 'legal', 'constructive', 'onerous-contract', 'decommissioning', 'warranty', 'restructuring' */
    provisionType: text('provision_type').notNull(),
    /** GL account for the provision liability */
    liabilityAccountId: uuid('liability_account_id'),
    /** GL account for the provision expense */
    expenseAccountId: uuid('expense_account_id'),
    /** Best estimate of the obligation in minor units */
    bestEstimateMinor: bigint('best_estimate_minor', { mode: 'number' }).notNull(),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Discount rate (for present-value calculations) */
    discountRate: numeric('discount_rate', { precision: 8, scale: 6 }),
    /** Present value of the provision in minor units */
    presentValueMinor: bigint('present_value_minor', { mode: 'number' }),
    /** Recognition date */
    recognitionDate: date('recognition_date').notNull(),
    /** Expected settlement date */
    expectedSettlementDate: date('expected_settlement_date'),
    /** Whether the provision is still active */
    isActive: boolean('is_active').notNull().default(true),
    /** Notes / description of circumstances */
    description: text('description'),
  },
  (table) => [
    tenantPk(table),
    index('prov_org_id_idx').on(table.orgId, table.id),
    index('prov_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by company + type
    index('prov_company_type_idx').on(table.orgId, table.companyId, table.provisionType),
    // Lookup by active status
    index('prov_active_idx').on(table.orgId, table.isActive),
    check('prov_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'prov_valid_type',
      sql`provision_type IN ('legal', 'constructive', 'onerous-contract', 'decommissioning', 'warranty', 'restructuring')`,
    ),

    tenantPolicy(table),
  ],
);

export type Provision = typeof provisions.$inferSelect;
export type NewProvision = typeof provisions.$inferInsert;
