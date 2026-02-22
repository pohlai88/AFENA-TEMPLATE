import { sql } from 'drizzle-orm';
import { bigint, check, date, index, integer, jsonb, numeric, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const assets = pgTable(
  'assets',
  {
    ...erpEntityColumns,

    assetNumber: text('asset_number').notNull(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    serialNumber: text('serial_number'),
    purchaseDate: date('purchase_date'),
    purchasePrice: numeric('purchase_price', { precision: 18, scale: 2 }),
    location: text('location'),
    status: text('status').notNull().default('active'),
    assetData: jsonb('asset_data').notNull().default(sql`'{}'::jsonb`),

    // ── Depreciation Fields (Phase A Accounting) ─────────────
    /** Acquisition cost in minor units (cents) for depreciation calculation */
    acquisitionCostMinor: bigint('acquisition_cost_minor', { mode: 'number' }),
    /** Residual/salvage value in minor units (cents) */
    residualValueMinor: bigint('residual_value_minor', { mode: 'number' }),
    /** Useful life in months for depreciation */
    usefulLifeMonths: integer('useful_life_months'),
    /** Depreciation method: 'straight_line', 'declining_balance', 'units_of_production', 'none' */
    depreciationMethod: text('depreciation_method').default('none'),
  },
  (table) => [
    tenantPk(table),
    index('assets_org_id_idx').on(table.orgId, table.id),
    index('assets_org_created_idx').on(table.orgId, table.createdAt),
    check('assets_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),

    tenantPolicy(table),
  ],
);

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
