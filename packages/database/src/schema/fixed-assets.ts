import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const fixedAssets = pgTable(
  'fixed_assets',
  {
    ...erpEntityColumns,

    assetNumber: text('asset_number').notNull(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    acquisitionDate: date('acquisition_date'),
    acquisitionCost: numeric('acquisition_cost', { precision: 18, scale: 2 }),
    depreciationMethod: text('depreciation_method'),
    usefulLife: integer('useful_life'),
    salvageValue: numeric('salvage_value', { precision: 18, scale: 2 }),
    assetDetails: jsonb('asset_details').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    index('fixed_assets_org_id_idx').on(table.orgId, table.id),
    index('fixed_assets_org_created_idx').on(table.orgId, table.createdAt),
    check('fixed_assets_org_not_empty', sql`org_id <> ''`),

    tenantPolicy(table),
  ],
);

export type FixedAsset = typeof fixedAssets.$inferSelect;
export type NewFixedAsset = typeof fixedAssets.$inferInsert;
