/**
 * Billing Cycles Table
 *
 * Individual billing cycle records generated from subscriptions.
 * Each row represents one billing period with its invoice outcome.
 * Missing sub-ledger table — Phase 3, step 17.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, date, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const billingCycles = pgTable(
  'billing_cycles',
  {
    ...erpEntityColumns,

    /** FK to subscriptions */
    subscriptionId: uuid('subscription_id').notNull(),
    /** Billing period start date */
    periodStart: date('period_start').notNull(),
    /** Billing period end date */
    periodEnd: date('period_end').notNull(),
    /** Billing amount in minor units */
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Status: 'pending', 'invoiced', 'paid', 'failed', 'void' */
    status: text('status').notNull().default('pending'),
    /** FK to the generated invoice (if invoiced) */
    invoiceId: uuid('invoice_id'),
    /** Payment reference (if paid) */
    paymentRef: text('payment_ref'),
    /** Failure reason (if failed) */
    failureReason: text('failure_reason'),
  },
  (table) => [
    tenantPk(table),
    index('bc_org_id_idx').on(table.orgId, table.id),
    index('bc_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by subscription
    index('bc_subscription_idx').on(table.orgId, table.subscriptionId),
    // Lookup by status
    index('bc_status_idx').on(table.orgId, table.status),
    // Lookup by period
    index('bc_period_idx').on(table.orgId, table.periodStart, table.periodEnd),
    check('bc_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('bc_valid_status', sql`status IN ('pending', 'invoiced', 'paid', 'failed', 'void')`),
    check('bc_valid_period', sql`period_end >= period_start`),

    tenantPolicy(table),
  ],
);

export type BillingCycle = typeof billingCycles.$inferSelect;
export type NewBillingCycle = typeof billingCycles.$inferInsert;
