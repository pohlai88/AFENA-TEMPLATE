import { sql } from 'drizzle-orm';
import {
  bigint,
  check,
  date,
  index,
  numeric,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { postingColumns } from '../helpers/posting-columns';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Sales orders — customer order document.
 *
 * Transactional Spine Migration 0035.
 * - 6-state posting_status (P-08)
 * - company_id NOT NULL (§3.12)
 * - Totals computed from SUM(lines) on every save (P-09, P-09a)
 */
export const salesOrders = pgTable(
  'sales_orders',
  {
    ...docEntityColumns,
    ...postingColumns,
    docNo: text('doc_no'),
    customerId: uuid('customer_id').notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    exchangeRate: numeric('exchange_rate', { precision: 12, scale: 6 }).default('1'),
    deliveryDate: date('delivery_date'),
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
    uniqueIndex('so_org_doc_no_uniq').on(table.orgId, table.docNo),
    index('so_org_customer_created_idx').on(table.orgId, table.customerId, table.createdAt),
    index('so_org_doc_status_idx').on(table.orgId, table.docStatus, table.updatedAt),
    index('so_org_posting_status_idx').on(table.orgId, table.postingStatus, table.postingDate),
    check('so_org_not_empty', sql`org_id <> ''`),
    check('so_company_required', sql`company_id IS NOT NULL`),
    check('so_total_non_negative', sql`total_minor >= 0`),
    check('so_tax_non_negative', sql`tax_minor >= 0`),
    check('so_grand_total_non_negative', sql`grand_total_minor >= 0`),
    check(
      'so_posting_status_valid',
      sql`posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed')`,
    ),
    tenantPolicy(table),
  ],
);

export type SalesOrder = typeof salesOrders.$inferSelect;
export type NewSalesOrder = typeof salesOrders.$inferInsert;
