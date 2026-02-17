import { desc, sql } from 'drizzle-orm';
import { check, index, integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Project Template Tasks — tasks within project templates.
 * Source: project-template-tasks.spec.json (adopted from ERPNext Project Template Task).
 */
export const projectTemplateTasks = pgTable(
  'project_template_tasks',
  {
    ...erpEntityColumns,
    taskName: text('task_name').notNull(),
    description: text('description'),
    duration: integer('duration'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('project_template_tasks_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('project_template_tasks_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ProjectTemplateTask = typeof projectTemplateTasks.$inferSelect;
export type NewProjectTemplateTask = typeof projectTemplateTasks.$inferInsert;
