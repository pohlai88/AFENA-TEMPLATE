import { sql } from 'drizzle-orm';
import {
  bigint,
  check,
  date,
  foreignKey,
  index,
  numeric,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { postingColumns } from '../helpers/posting-columns';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Purchase orders — supplier order document.
 *
 * RULE C-01: Purchase orders are ISSUER-scoped (company issues POs to suppliers).
 * Transactional Spine Migration 0036: Buying Cycle.
 * - Mirror of sales_orders with supplierId
 * - 6-state posting_status (P-08)
 * - company_id NOT NULL (§3.12)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const purchaseOrders = pgTable(
  'purchase_orders',
  {
    ...docEntityColumns,
    ...postingColumns,
    docNo: text('doc_no'),
    supplierId: uuid('supplier_id').notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    exchangeRate: numeric('exchange_rate', { precision: 12, scale: 6 }).default('1'),
    expectedDate: date('expected_date'),
    paymentTerms: text('payment_terms'),
    totalMinor: bigint('total_minor', { mode: 'number' }).notNull().default(0),
    discountMinor: bigint('discount_minor', { mode: 'number' }).notNull().default(0),
    taxMinor: bigint('tax_minor', { mode: 'number' }).notNull().default(0),
    grandTotalMinor: bigint('grand_total_minor', { mode: 'number' }).notNull().default(0),
    billingAddressId: uuid('billing_address_id'),
    shippingAddressId: uuid('shipping_address_id'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'purchase_orders_company_fk',
    }),
    uniqueIndex('po_org_doc_no_uniq').on(table.orgId, table.docNo),
    index('po_org_supplier_created_idx').on(table.orgId, table.supplierId, table.createdAt),
    index('po_org_doc_status_idx').on(table.orgId, table.docStatus, table.updatedAt),
    index('po_org_posting_status_idx').on(table.orgId, table.postingStatus, table.postingDate),
    check('po_org_not_empty', sql`org_id <> ''`),
    check('po_company_required', sql`company_id IS NOT NULL`),
    check('po_total_non_negative', sql`total_minor >= 0`),
    check('po_tax_non_negative', sql`tax_minor >= 0`),
    check('po_grand_total_non_negative', sql`grand_total_minor >= 0`),
    check(
      'po_posting_status_valid',
      sql`posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed')`,
    ),
    tenantPolicy(table),
  ],
);

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert;
