import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { tasks } from './tasks';

/**
 * Dependent Tasks — task dependency relationships.
 * Source: dependent-tasks.spec.json (adopted from ERPNext Dependent Task).
 * Defines dependencies between tasks for Gantt chart and scheduling.
 */
export const dependentTasks = pgTable(
  'dependent_tasks',
  {
    ...erpEntityColumns,
    task: uuid('task').references(() => tasks.id),
    dependentTask: uuid('dependent_task').references(() => tasks.id),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('dependent_tasks_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('dependent_tasks_org_task_idx').on(table.orgId, table.task),
    index('dependent_tasks_org_dependent_idx').on(table.orgId, table.dependentTask),
    check('dependent_tasks_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type DependentTask = typeof dependentTasks.$inferSelect;
export type NewDependentTask = typeof dependentTasks.$inferInsert;
