import { sql } from 'drizzle-orm';
import { bigint, check, foreignKey, index, numeric, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Stock balances — pre-aggregated current stock position per item/site.
 *
 * RULE C-01: Stock balances are OPERATIONS-scoped (company owns inventory).
 * Audit P1-12:
 * - Avoids full SUM(qty) scan over stock_movements for every stock check
 * - Updated by stock movement posting logic (increment/decrement)
 * - UNIQUE(org_id, company_id, site_id, item_id) — one balance per location
 * - qty_on_hand: physical stock
 * - qty_reserved: allocated to orders but not yet issued
 * - qty_available: on_hand - reserved (computed by application)
 * - valuation_minor: current inventory value in minor units
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const stockBalances = pgTable(
  'stock_balances',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    companyId: uuid('company_id').notNull(),
    siteId: uuid('site_id').notNull(),
    itemId: uuid('item_id').notNull(),
    qtyOnHand: numeric('qty_on_hand', { precision: 20, scale: 6 }).notNull().default('0'),
    qtyReserved: numeric('qty_reserved', { precision: 20, scale: 6 }).notNull().default('0'),
    qtyOrdered: numeric('qty_ordered', { precision: 20, scale: 6 }).notNull().default('0'),
    valuationMinor: bigint('valuation_minor', { mode: 'number' }).notNull().default(0),
    currencyCode: text('currency_code').notNull().default('MYR'),
    lastMovementAt: timestamp('last_movement_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'stock_balances_company_fk',
    }),
    index('stock_bal_org_id_idx').on(table.orgId, table.id),
    index('stock_bal_org_company_idx').on(table.orgId, table.companyId),
    index('stock_bal_org_item_idx').on(table.orgId, table.itemId),
    uniqueIndex('stock_bal_org_company_site_item_uniq').on(
      table.orgId,
      table.companyId,
      table.siteId,
      table.itemId,
    ),
    check('stock_bal_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type StockBalance = typeof stockBalances.$inferSelect;
export type NewStockBalance = typeof stockBalances.$inferInsert;
