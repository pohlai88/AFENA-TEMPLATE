import { sql } from 'drizzle-orm';
import { boolean, check, date, foreignKey, index, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Projects — ledger dimension for project-based costing/revenue tracking.
 *
 * RULE C-01: Projects are LEGAL-scoped (company-specific project tracking).
 * PRD Phase D #14 + G0.3:
 * - Typed column approach (project_id on journal_lines)
 * - status lifecycle: active → completed → archived
 * - UNIQUE(org_id, company_id, code)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
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
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'projects_company_fk',
    }),
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
