import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Project Templates — reusable project templates with predefined tasks.
 * Source: project-templates.spec.json (adopted from ERPNext Project Template).
 */
export const projectTemplates = pgTable(
  'project_templates',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('project_templates_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('project_templates_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ProjectTemplate = typeof projectTemplates.$inferSelect;
export type NewProjectTemplate = typeof projectTemplates.$inferInsert;
