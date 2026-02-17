import { desc, sql } from 'drizzle-orm';
import { check, decimal, index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { activityTypes } from './activity-types';

/**
 * Activity Costs — cost tracking per activity type and employee.
 * Source: activity-costs.spec.json (adopted from ERPNext Activity Cost).
 * Tracks billing and costing rates for specific activity-employee combinations.
 */
export const activityCosts = pgTable(
  'activity_costs',
  {
    ...erpEntityColumns,
    activityType: uuid('activity_type').notNull().references(() => activityTypes.id),
    employee: uuid('employee'),
    employeeName: uuid('employee_name'),
    costingRate: decimal('costing_rate', { precision: 18, scale: 2 }),
    billingRate: decimal('billing_rate', { precision: 18, scale: 2 }),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('activity_costs_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('activity_costs_org_activity_idx').on(table.orgId, table.activityType),
    index('activity_costs_org_employee_idx').on(table.orgId, table.employee),
    check('activity_costs_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ActivityCost = typeof activityCosts.$inferSelect;
export type NewActivityCost = typeof activityCosts.$inferInsert;
