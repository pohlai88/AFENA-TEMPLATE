import { sql } from 'drizzle-orm';
import { boolean, check, date, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Projects — ledger dimension for project-based costing/revenue tracking.
 *
 * PRD Phase D #14 + G0.3:
 * - Typed column approach (project_id on journal_lines)
 * - status lifecycle: active → completed → archived
 * - UNIQUE(org_id, company_id, code)
 */
export const projects = pgTable(
  'projects',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    code: text('code').notNull(),
    name: text('name').notNull(),
    status: text('status').notNull().default('active'),
    startDate: date('start_date'),
    endDate: date('end_date'),
    managerId: text('manager_id'),
    isActive: boolean('is_active').notNull().default(true),
    description: text('description'),
  },
  (table) => [
    index('projects_org_id_idx').on(table.orgId, table.id),
    index('projects_org_company_idx').on(table.orgId, table.companyId),
    uniqueIndex('projects_org_company_code_uniq').on(
      table.orgId,
      table.companyId,
      table.code,
    ),
    check('projects_org_not_empty', sql`org_id <> ''`),
    check('projects_status_valid', sql`status IN ('active', 'completed', 'archived')`),
    check('projects_date_order', sql`end_date IS NULL OR start_date IS NULL OR start_date <= end_date`),
    tenantPolicy(table),
  ],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
