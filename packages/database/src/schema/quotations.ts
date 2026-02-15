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
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Quotations — pre-sales document. NO posting columns.
 *
 * RULE C-01: Quotations are ISSUER-scoped (company issues quotes).
 * Transactional Spine Migration 0037.
 * - party_type: customer/supplier (supports both sales and purchase quotations)
 * - No posting_status, no posting_date (quotations are never posted)
 * - Totals computed from SUM(lines) on every save (P-09a rule still applies)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const quotations = pgTable(
  'quotations',
  {
    ...docEntityColumns,
    docNo: text('doc_no'),
    partyType: text('party_type').notNull().default('customer'),
    partyId: uuid('party_id').notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    exchangeRate: numeric('exchange_rate', { precision: 12, scale: 6 }).default('1'),
    validUntil: date('valid_until'),
    totalMinor: bigint('total_minor', { mode: 'number' }).notNull().default(0),
    discountMinor: bigint('discount_minor', { mode: 'number' }).notNull().default(0),
    taxMinor: bigint('tax_minor', { mode: 'number' }).notNull().default(0),
    grandTotalMinor: bigint('grand_total_minor', { mode: 'number' }).notNull().default(0),
    billingAddressId: uuid('billing_address_id'),
    shippingAddressId: uuid('shipping_address_id'),
    paymentTerms: text('payment_terms'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'quotations_company_fk',
    }),
    uniqueIndex('qtn_org_doc_no_uniq').on(table.orgId, table.docNo),
    index('qtn_org_party_created_idx').on(table.orgId, table.partyId, table.createdAt),
    index('qtn_org_doc_status_idx').on(table.orgId, table.docStatus, table.updatedAt),
    check('qtn_org_not_empty', sql`org_id <> ''`),
    check('qtn_total_non_negative', sql`total_minor >= 0`),
    check('qtn_tax_non_negative', sql`tax_minor >= 0`),
    check('qtn_grand_total_non_negative', sql`grand_total_minor >= 0`),
    check(
      'qtn_party_type_valid',
      sql`party_type IN ('customer', 'supplier')`,
    ),
    tenantPolicy(table),
  ],
);

export type Quotation = typeof quotations.$inferSelect;
export type NewQuotation = typeof quotations.$inferInsert;
