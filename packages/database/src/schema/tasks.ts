import { desc, sql } from 'drizzle-orm';
import { boolean, check, date, decimal, index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { projects } from './projects';

/**
 * Tasks — project task management.
 * Source: tasks.spec.json (adopted from ERPNext Task).
 * Master entity for tracking tasks within projects.
 */
export const tasks = pgTable(
  'tasks',
  {
    ...erpEntityColumns,
    subject: text('subject').notNull(),
    project: uuid('project').references(() => projects.id),
    issue: uuid('issue'),
    typeCol: uuid('type_col'),
    color: text('color'),
    isGroup: boolean('is_group').notNull().default(false),
    isTemplate: boolean('is_template').notNull().default(false),
    priority: text('priority'),
    statusCol: text('status_col'),
    expStartDate: date('exp_start_date'),
    expEndDate: date('exp_end_date'),
    expectedTime: decimal('expected_time', { precision: 18, scale: 2 }),
    progress: text('progress'),
    duration: decimal('duration', { precision: 18, scale: 2 }),
    description: text('description'),
    parentTask: uuid('parent_task').references((): any => tasks.id),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('tasks_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('tasks_org_project_idx').on(table.orgId, table.project),
    index('tasks_org_status_idx').on(table.orgId, table.statusCol),
    index('tasks_org_parent_idx').on(table.orgId, table.parentTask),
    check('tasks_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
