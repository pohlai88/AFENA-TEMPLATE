/**
 * Subscriptions Table
 *
 * Customer subscription records for recurring billing.
 * Tracks subscription lifecycle, pricing, and renewal terms.
 * Missing sub-ledger table — Phase 3, step 17.
 */
import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  date,
  index,
  jsonb,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const subscriptions = pgTable(
  'subscriptions',
  {
    ...erpEntityColumns,

    /** Subscription number */
    subscriptionNo: text('subscription_no').notNull(),
    /** FK to customers / contacts */
    customerId: uuid('customer_id').notNull(),
    /** Plan / product name */
    planName: text('plan_name').notNull(),
    /** Status: 'trial', 'active', 'paused', 'cancelled', 'expired' */
    status: text('status').notNull().default('active'),
    /** Billing frequency: 'monthly', 'quarterly', 'semi-annual', 'annual' */
    billingFrequency: text('billing_frequency').notNull().default('monthly'),
    /** Recurring amount in minor units */
    recurringAmountMinor: bigint('recurring_amount_minor', { mode: 'number' }).notNull(),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Start date */
    startDate: date('start_date').notNull(),
    /** End date (null = auto-renewing) */
    endDate: date('end_date'),
    /** Next billing date */
    nextBillingDate: date('next_billing_date'),
    /** Whether auto-renewal is enabled */
    autoRenew: boolean('auto_renew').notNull().default(true),
    /** Cancellation date (if cancelled) */
    cancelledDate: date('cancelled_date'),
    /** Additional subscription details (JSONB: features, usage limits) */
    subscriptionDetails: jsonb('subscription_details')
      .notNull()
      .default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('sub_org_id_idx').on(table.orgId, table.id),
    index('sub_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by customer
    index('sub_customer_idx').on(table.orgId, table.customerId),
    // Lookup by status
    index('sub_status_idx').on(table.orgId, table.status),
    // Lookup by next billing date (billing run)
    index('sub_next_billing_idx').on(table.orgId, table.nextBillingDate, table.status),
    check('sub_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('sub_valid_status', sql`status IN ('trial', 'active', 'paused', 'cancelled', 'expired')`),
    check(
      'sub_valid_frequency',
      sql`billing_frequency IN ('monthly', 'quarterly', 'semi-annual', 'annual')`,
    ),

    tenantPolicy(table),
  ],
);

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
