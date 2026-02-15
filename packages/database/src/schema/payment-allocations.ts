import { sql } from 'drizzle-orm';
import { bigint, check, date, foreignKey, index, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Payment allocations — links payments to invoices/credit notes.
 *
 * RULE C-01: Payment allocations are ISSUER-scoped (company allocates payments).
 * PRD G0.8 + Phase B #9.5:
 * - Supports partial allocation, over/under-payment handling
 * - allocated_amount in minor units (integer, no floats)
 * - allocation_type: 'payment', 'credit_note', 'write_off', 'refund'
 * - Affects GL journalization (payment → journal references matched invoices)
 * - UNIQUE(org_id, payment_id, target_id) prevents double-allocation
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const paymentAllocations = pgTable(
  'payment_allocations',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    paymentId: uuid('payment_id').notNull(),
    targetType: text('target_type').notNull(),
    targetId: uuid('target_id').notNull(),
    allocationType: text('allocation_type').notNull().default('payment'),
    allocatedAmount: bigint('allocated_amount', { mode: 'number' }).notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    fxRate: text('fx_rate'),
    baseAllocatedAmount: bigint('base_allocated_amount', { mode: 'number' }).notNull(),
    allocationDate: date('allocation_date').notNull(),
    journalEntryId: uuid('journal_entry_id'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'payment_allocations_company_fk',
    }),
    index('payment_alloc_org_id_idx').on(table.orgId, table.id),
    index('payment_alloc_payment_idx').on(table.orgId, table.paymentId),
    index('payment_alloc_target_idx').on(table.orgId, table.targetType, table.targetId),
    index('payment_alloc_company_idx').on(table.orgId, table.companyId),
    uniqueIndex('payment_alloc_payment_target_uniq').on(
      table.orgId,
      table.paymentId,
      table.targetId,
    ),
    check('payment_alloc_org_not_empty', sql`org_id <> ''`),
    check('payment_alloc_amount_positive', sql`allocated_amount > 0`),
    check('payment_alloc_type_valid', sql`allocation_type IN ('payment', 'credit_note', 'write_off', 'refund')`),
    check('payment_alloc_target_type_valid', sql`target_type IN ('invoice', 'credit_note', 'debit_note')`),
    tenantPolicy(table),
  ],
);

export type PaymentAllocation = typeof paymentAllocations.$inferSelect;
export type NewPaymentAllocation = typeof paymentAllocations.$inferInsert;
