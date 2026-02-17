import { desc, sql } from 'drizzle-orm';
import { boolean, check, decimal, index, pgTable, primaryKey, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Activity Types — categorization for activities and time tracking.
 * Source: activity-types.spec.json (adopted from ERPNext Activity Type).
 * Master data for categorizing activities with billing and costing rates.
 */
export const activityTypes = pgTable(
  'activity_types',
  {
    ...erpEntityColumns,
    activityType: text('activity_type').notNull(),
    costingRate: decimal('costing_rate', { precision: 18, scale: 2 }),
    billingRate: decimal('billing_rate', { precision: 18, scale: 2 }),
    disabled: boolean('disabled').notNull().default(false),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('activity_types_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('activity_types_org_name_idx').on(table.orgId, table.activityType),
    unique('activity_types_org_name_unique').on(table.orgId, table.activityType),
    check('activity_types_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ActivityType = typeof activityTypes.$inferSelect;
export type NewActivityType = typeof activityTypes.$inferInsert;
