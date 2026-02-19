import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const projects = pgTable(
  'projects',
  {
    ...erpEntityColumns,
    code: text('code').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    projectManager: text('project_manager'),
    startDate: date('start_date'),
    endDate: date('end_date'),
    status: text('status').notNull().default('active'),
    budget: text('budget'),
    metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    index('projects_org_id_idx').on(table.orgId, table.id),
    index('projects_org_code_idx').on(table.orgId, table.code),
    index('projects_org_created_idx').on(table.orgId, table.createdAt),
    check('projects_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
