import { sql } from 'drizzle-orm';
import { bigint, check, date, foreignKey, index, integer, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Fixed assets — capitalized assets with depreciation tracking.
 *
 * RULE C-01: Fixed assets are LEGAL-scoped (company owns assets).
 * PRD Phase E #20 + G0.20:
 * - Lifecycle: acquired → in_service → disposed
 * - Depreciation methods: straight_line, declining_balance, units_of_production
 * - Links to GL accounts for cost, depreciation, accumulated depreciation
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const assets = pgTable(
  'assets',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    assetCode: text('asset_code').notNull(),
    name: text('name').notNull(),
    category: text('category'),
    status: text('status').notNull().default('acquired'),
    acquisitionDate: date('acquisition_date').notNull(),
    acquisitionCostMinor: bigint('acquisition_cost_minor', { mode: 'number' }).notNull(),
    residualValueMinor: bigint('residual_value_minor', { mode: 'number' }).notNull().default(0),
    usefulLifeMonths: integer('useful_life_months').notNull(),
    depreciationMethod: text('depreciation_method').notNull().default('straight_line'),
    currencyCode: text('currency_code').notNull().default('MYR'),
    costAccountId: uuid('cost_account_id'),
    depreciationAccountId: uuid('depreciation_account_id'),
    accumDepreciationAccountId: uuid('accum_depreciation_account_id'),
    disposalDate: date('disposal_date'),
    disposalAmountMinor: bigint('disposal_amount_minor', { mode: 'number' }),
    siteId: uuid('site_id'),
    sourceInvoiceId: uuid('source_invoice_id'),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'assets_company_fk',
    }),
    index('assets_org_id_idx').on(table.orgId, table.id),
    index('assets_org_company_idx').on(table.orgId, table.companyId),
    index('assets_status_idx').on(table.orgId, table.status),
    check('assets_org_not_empty', sql`org_id <> ''`),
    check('assets_status_valid', sql`status IN ('acquired', 'in_service', 'disposed', 'written_off')`),
    check('assets_depreciation_valid', sql`depreciation_method IN ('straight_line', 'declining_balance', 'units_of_production', 'none')`),
    check('assets_cost_positive', sql`acquisition_cost_minor > 0`),
    check('assets_life_positive', sql`useful_life_months > 0`),
    tenantPolicy(table),
  ],
);

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

/**
 * Depreciation schedules — period-by-period depreciation entries.
 * Append-only evidence.
 */
export const depreciationSchedules = pgTable(
  'depreciation_schedules',
  {
    ...baseEntityColumns,
    assetId: uuid('asset_id').notNull(),
    fiscalPeriodId: uuid('fiscal_period_id').notNull(),
    depreciationMinor: bigint('depreciation_minor', { mode: 'number' }).notNull(),
    accumDepreciationMinor: bigint('accum_depreciation_minor', { mode: 'number' }).notNull(),
    bookValueMinor: bigint('book_value_minor', { mode: 'number' }).notNull(),
    journalEntryId: uuid('journal_entry_id'),
    memo: text('memo'),
  },
  (table) => [
    index('dep_sched_org_id_idx').on(table.orgId, table.id),
    index('dep_sched_asset_idx').on(table.orgId, table.assetId),
    index('dep_sched_period_idx').on(table.orgId, table.fiscalPeriodId),
    check('dep_sched_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type DepreciationSchedule = typeof depreciationSchedules.$inferSelect;
export type NewDepreciationSchedule = typeof depreciationSchedules.$inferInsert;

/**
 * Asset events — lifecycle events (acquire, adjust, dispose).
 * Append-only evidence.
 */
export const assetEvents = pgTable(
  'asset_events',
  {
    ...baseEntityColumns,
    assetId: uuid('asset_id').notNull(),
    eventType: text('event_type').notNull(),
    eventDate: date('event_date').notNull(),
    amountMinor: bigint('amount_minor', { mode: 'number' }),
    journalEntryId: uuid('journal_entry_id'),
    performedBy: text('performed_by').notNull(),
    reason: text('reason'),
    memo: text('memo'),
  },
  (table) => [
    index('asset_events_org_id_idx').on(table.orgId, table.id),
    index('asset_events_asset_idx').on(table.orgId, table.assetId),
    check('asset_events_org_not_empty', sql`org_id <> ''`),
    check('asset_events_type_valid', sql`event_type IN ('acquire', 'adjust', 'revalue', 'transfer', 'dispose', 'write_off', 'impair')`),
    tenantPolicy(table),
  ],
);

export type AssetEvent = typeof assetEvents.$inferSelect;
export type NewAssetEvent = typeof assetEvents.$inferInsert;
