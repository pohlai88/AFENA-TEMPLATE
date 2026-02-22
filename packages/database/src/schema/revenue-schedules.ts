/**
 * Revenue Schedules Table
 *
 * Master schedule for revenue recognition over time.
 * Links to contracts/invoices and defines recognition pattern.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, date, index, jsonb, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const revenueSchedules = pgTable(
  'revenue_schedules',
  {
    ...erpEntityColumns,

    /** Source entity type: 'invoice', 'contract', 'subscription' */
    sourceEntityType: text('source_entity_type').notNull(),
    /** Reference to the source entity */
    sourceEntityId: uuid('source_entity_id').notNull(),
    /** Total revenue amount to recognize (in minor units) */
    totalAmountMinor: bigint('total_amount_minor', { mode: 'number' }).notNull(),
    /** Currency code */
    currencyCode: text('currency_code').notNull(),
    /** Recognition method: 'straight_line', 'percentage_complete', 'milestone', 'output' */
    recognitionMethod: text('recognition_method').notNull(),
    /** Start date of recognition period */
    startDate: date('start_date').notNull(),
    /** End date of recognition period */
    endDate: date('end_date').notNull(),
    /** Schedule status: 'draft', 'active', 'completed', 'cancelled' */
    status: text('status').notNull().default('draft'),
    /** Revenue account for recognition entries */
    revenueAccountId: uuid('revenue_account_id'),
    /** Deferred revenue account */
    deferredAccountId: uuid('deferred_account_id'),
    /** Additional schedule configuration */
    scheduleConfig: jsonb('schedule_config').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('revenue_schedules_org_id_idx').on(table.orgId, table.id),
    index('revenue_schedules_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by source entity
    index('revenue_schedules_source_idx').on(table.orgId, table.sourceEntityType, table.sourceEntityId),
    // Lookup by date range
    index('revenue_schedules_date_idx').on(table.orgId, table.startDate, table.endDate),
    // Unique: one active schedule per source entity
    uniqueIndex('revenue_schedules_unique_idx')
      .on(table.orgId, table.sourceEntityType, table.sourceEntityId)
      .where(sql`status IN ('draft', 'active')`),
    check('revenue_schedules_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('revenue_schedules_valid_dates', sql`end_date >= start_date`),

    tenantPolicy(table),
  ],
);

export type RevenueSchedule = typeof revenueSchedules.$inferSelect;
export type NewRevenueSchedule = typeof revenueSchedules.$inferInsert;
