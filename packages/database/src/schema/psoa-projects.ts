import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { projects } from './projects';

/**
 * PSOA Projects — Professional Services Order Agreement project links.
 * Source: psoa-projects.spec.json (adopted from ERPNext PSOA Project).
 * Links projects to Professional Services Order Agreements.
 */
export const psoaProjects = pgTable(
  'psoa_projects',
  {
    ...erpEntityColumns,
    projectName: uuid('project_name').references(() => projects.id),
    costCenter: uuid('cost_center'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('psoa_projects_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('psoa_projects_org_project_idx').on(table.orgId, table.projectName),
    check('psoa_projects_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type PsoaProject = typeof psoaProjects.$inferSelect;
export type NewPsoaProject = typeof psoaProjects.$inferInsert;
