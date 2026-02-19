/**
 * Payment Allocations Table
 *
 * Tracks how payments are allocated to invoices.
 * Supports partial payments and multi-invoice allocation.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const paymentAllocations = pgTable(
  'payment_allocations',
  {
    ...erpEntityColumns,

    /** Reference to the payment */
    paymentId: uuid('payment_id').notNull(),
    /** Reference to the invoice being paid */
    invoiceId: uuid('invoice_id').notNull(),
    /** Amount allocated from this payment to this invoice (in minor units) */
    allocatedAmountMinor: bigint('allocated_amount_minor', { mode: 'number' }).notNull(),
    /** Currency code for the allocation */
    currencyCode: text('currency_code').notNull(),
    /** Allocation type: 'principal', 'interest', 'penalty', 'discount' */
    allocationType: text('allocation_type').notNull().default('principal'),
    /** Status: 'pending', 'applied', 'reversed' */
    status: text('status').notNull().default('pending'),
    /** When the allocation was applied */
    appliedAt: timestamp('applied_at', { withTimezone: true }),
    /** Reference to the journal entry created for this allocation */
    journalEntryId: uuid('journal_entry_id'),
    /** Additional allocation metadata */
    allocationMetadata: jsonb('allocation_metadata').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('payment_allocations_org_id_idx').on(table.orgId, table.id),
    index('payment_allocations_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by payment
    index('payment_allocations_payment_idx').on(table.orgId, table.paymentId),
    // Lookup by invoice
    index('payment_allocations_invoice_idx').on(table.orgId, table.invoiceId),
    // Unique: prevent duplicate allocations
    uniqueIndex('payment_allocations_unique_idx').on(table.orgId, table.paymentId, table.invoiceId, table.allocationType),
    check('payment_allocations_org_not_empty', sql`org_id <> ''`),
    check('payment_allocations_positive_amount', sql`allocated_amount_minor > 0`),

    tenantPolicy(table),
  ],
);

export type PaymentAllocation = typeof paymentAllocations.$inferSelect;
export type NewPaymentAllocation = typeof paymentAllocations.$inferInsert;
