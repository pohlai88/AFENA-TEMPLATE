import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Project Types — master data for project classification.
 * Source: project-types.spec.json (adopted from ERPNext Project Type).
 */
export const projectTypes = pgTable(
  'project_types',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
    description: text('description'),
  },
  (table) => [
    index('project_types_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    unique('project_types_org_name_unique').on(table.orgId, table.name),
    check('project_types_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ProjectType = typeof projectTypes.$inferSelect;
export type NewProjectType = typeof projectTypes.$inferInsert;
