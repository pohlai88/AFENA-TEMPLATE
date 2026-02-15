import { sql } from 'drizzle-orm';
import { bigint, boolean, check, date, foreignKey, index, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Price lists — pricing engine for deterministic price resolution.
 *
 * RULE C-01: Price lists are LEGAL-scoped (company-specific pricing).
 * PRD Phase D #18.5 + G0.16:
 * - Resolution order: customer-specific → price list → campaign → default
 * - Time-bounded: effective_from / effective_to
 * - UNIQUE(org_id, code) per price list
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const priceLists = pgTable(
  'price_lists',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id'),
    code: text('code').notNull(),
    name: text('name').notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    isDefault: boolean('is_default').notNull().default(false),
    effectiveFrom: date('effective_from'),
    effectiveTo: date('effective_to'),
    isActive: boolean('is_active').notNull().default(true),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'price_lists_company_fk',
    }).onDelete('cascade'),
    index('price_lists_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('price_lists_org_code_uniq').on(table.orgId, table.code),
    check('price_lists_org_not_empty', sql`org_id <> ''`),
    check('price_lists_date_order', sql`effective_to IS NULL OR effective_from IS NULL OR effective_from <= effective_to`),
    tenantPolicy(table),
  ],
);

export type PriceList = typeof priceLists.$inferSelect;
export type NewPriceList = typeof priceLists.$inferInsert;

/**
 * Price list items — individual product prices within a price list.
 *
 * - price_minor: integer minor units (no floats)
 * - min_qty: minimum quantity for this price tier
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const priceListItems = pgTable(
  'price_list_items',
  {
    ...baseEntityColumns,
    priceListId: uuid('price_list_id').notNull(),
    productId: uuid('product_id'),
    productGroupCode: text('product_group_code'),
    priceMinor: bigint('price_minor', { mode: 'number' }).notNull(),
    minQty: bigint('min_qty', { mode: 'number' }).notNull().default(1),
    discountPercent: text('discount_percent'),
    currencyCode: text('currency_code').notNull().default('MYR'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('pli_org_id_idx').on(table.orgId, table.id),
    index('pli_price_list_idx').on(table.orgId, table.priceListId),
    index('pli_product_idx').on(table.orgId, table.productId),
    check('pli_org_not_empty', sql`org_id <> ''`),
    check('pli_price_non_negative', sql`price_minor >= 0`),
    check('pli_min_qty_positive', sql`min_qty > 0`),
    tenantPolicy(table),
  ],
);

export type PriceListItem = typeof priceListItems.$inferSelect;
export type NewPriceListItem = typeof priceListItems.$inferInsert;
