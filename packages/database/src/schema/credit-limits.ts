/**
 * Credit Limits Table
 *
 * Customer credit limit definitions and current exposure tracking.
 * Supports tiered limits by customer segment and currency.
 * Missing sub-ledger table — Phase 3, step 17.
 */
import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  date,
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const creditLimits = pgTable(
  'credit_limits',
  {
    ...erpEntityColumns,

    /** FK to customers / contacts */
    customerId: uuid('customer_id').notNull(),
    /** Credit limit amount in minor units */
    limitAmountMinor: bigint('limit_amount_minor', { mode: 'number' }).notNull(),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Current exposure / utilization in minor units */
    currentExposureMinor: bigint('current_exposure_minor', { mode: 'number' }).notNull().default(0),
    /** Available credit in minor units (limit - exposure) */
    availableCreditMinor: bigint('available_credit_minor', { mode: 'number' }).notNull(),
    /** Risk rating: 'low', 'medium', 'high', 'critical' */
    riskRating: text('risk_rating').notNull().default('medium'),
    /** Credit score (internal scoring) */
    creditScore: text('credit_score'),
    /** Effective from date */
    effectiveFrom: date('effective_from').notNull(),
    /** Effective to date (null = no expiry) */
    effectiveTo: date('effective_to'),
    /** Last review date */
    lastReviewDate: date('last_review_date'),
    /** Who approved this limit */
    approvedBy: text('approved_by'),
    /** Whether this limit is active */
    isActive: boolean('is_active').notNull().default(true),
    /** Notes */
    notes: text('notes'),
  },
  (table) => [
    tenantPk(table),
    index('cl_org_id_idx').on(table.orgId, table.id),
    index('cl_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by customer
    index('cl_customer_idx').on(table.orgId, table.customerId),
    // Lookup by risk rating
    index('cl_risk_idx').on(table.orgId, table.riskRating),
    // Unique active limit per customer + currency
    uniqueIndex('cl_unique_active_idx')
      .on(table.orgId, table.customerId, table.currencyCode)
      .where(sql`is_active = true`),
    check('cl_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('cl_valid_risk', sql`risk_rating IN ('low', 'medium', 'high', 'critical')`),
    check('cl_positive_limit', sql`limit_amount_minor >= 0`),

    tenantPolicy(table),
  ],
);

export type CreditLimit = typeof creditLimits.$inferSelect;
export type NewCreditLimit = typeof creditLimits.$inferInsert;
