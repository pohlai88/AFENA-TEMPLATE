import { desc, sql } from 'drizzle-orm';
import { boolean, check, decimal, index, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { activityTypes } from './activity-types';
import { projects } from './projects';
import { tasks } from './tasks';

/**
 * Timesheet Details — line items for timesheets.
 * Source: timesheet-details.spec.json (adopted from ERPNext Timesheet Detail).
 * Child entity containing individual time entries within a timesheet.
 */
export const timesheetDetails = pgTable(
  'timesheet_details',
  {
    ...erpEntityColumns,
    activityType: uuid('activity_type').references(() => activityTypes.id),
    fromTime: timestamp('from_time', { withTimezone: true }),
    description: text('description'),
    expectedHours: decimal('expected_hours', { precision: 18, scale: 2 }),
    toTime: timestamp('to_time', { withTimezone: true }),
    hours: decimal('hours', { precision: 18, scale: 2 }),
    completed: boolean('completed').notNull().default(false),
    project: uuid('project').references(() => projects.id),
    task: uuid('task').references(() => tasks.id),
    billingHours: decimal('billing_hours', { precision: 18, scale: 2 }),
    costingHours: decimal('costing_hours', { precision: 18, scale: 2 }),
    billingAmount: decimal('billing_amount', { precision: 18, scale: 2 }),
    costingAmount: decimal('costing_amount', { precision: 18, scale: 2 }),
    billingRate: decimal('billing_rate', { precision: 18, scale: 2 }),
    costingRate: decimal('costing_rate', { precision: 18, scale: 2 }),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('timesheet_details_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('timesheet_details_org_project_idx').on(table.orgId, table.project),
    index('timesheet_details_org_task_idx').on(table.orgId, table.task),
    index('timesheet_details_org_activity_idx').on(table.orgId, table.activityType),
    check('timesheet_details_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type TimesheetDetail = typeof timesheetDetails.$inferSelect;
export type NewTimesheetDetail = typeof timesheetDetails.$inferInsert;
