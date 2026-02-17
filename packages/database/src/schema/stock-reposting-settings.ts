import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Stock Reposting Settings — configuration for inventory reposting.
 * Source: stock-reposting-settings.spec.json (adopted from ERPNext Stock Reposting Settings).
 * Singleton config entity for stock valuation reposting.
 */
export const stockRepostingSettings = pgTable(
  'stock_reposting_settings',
  {
    ...erpEntityColumns,
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('stock_reposting_settings_org_singleton').on(table.orgId),
    index('stock_reposting_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('stock_reposting_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type StockRepostingSettings = typeof stockRepostingSettings.$inferSelect;
export type NewStockRepostingSettings = typeof stockRepostingSettings.$inferInsert;
