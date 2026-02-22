/**
 * Depreciation Schedules Table
 *
 * Stores calculated depreciation amounts per fiscal period per asset.
 * Used by the depreciation engine to track accumulated depreciation.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const depreciationSchedules = pgTable(
  'depreciation_schedules',
  {
    ...erpEntityColumns,

    /** Reference to the asset being depreciated */
    assetId: uuid('asset_id').notNull(),
    /** Reference to the fiscal period */
    fiscalPeriodId: uuid('fiscal_period_id').notNull(),
    /** Depreciation amount for this period (in minor units / cents) */
    depreciationMinor: bigint('depreciation_minor', { mode: 'number' }).notNull(),
    /** Accumulated depreciation up to and including this period (in minor units) */
    accumDepreciationMinor: bigint('accum_depreciation_minor', { mode: 'number' }).notNull(),
    /** Net book value after this period's depreciation (in minor units) */
    netBookValueMinor: bigint('net_book_value_minor', { mode: 'number' }).notNull(),
    /** Depreciation method used: 'straight_line', 'declining_balance', 'units_of_production' */
    method: text('method').notNull(),
    /** Status: 'calculated', 'posted', 'reversed' */
    status: text('status').notNull().default('calculated'),
  },
  (table) => [
    tenantPk(table),
    index('depreciation_schedules_org_id_idx').on(table.orgId, table.id),
    index('depreciation_schedules_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by asset
    index('depreciation_schedules_asset_idx').on(table.orgId, table.assetId),
    // Lookup by fiscal period
    index('depreciation_schedules_period_idx').on(table.orgId, table.fiscalPeriodId),
    // Unique: one schedule entry per asset per period
    uniqueIndex('depreciation_schedules_unique_idx').on(table.orgId, table.assetId, table.fiscalPeriodId),
    check('depreciation_schedules_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),

    tenantPolicy(table),
  ],
);

export type DepreciationSchedule = typeof depreciationSchedules.$inferSelect;
export type NewDepreciationSchedule = typeof depreciationSchedules.$inferInsert;
