import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, primaryKey, text, unique, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Departments — organizational departments/divisions.
 * Source: departments.spec.json (adopted from ERPNext Department).
 * Master entity for organizational structure with hierarchical support.
 */
export const departments = pgTable(
  'departments',
  {
    ...erpEntityColumns,
    /** Department name (unique per organization) */
    departmentName: text('department_name').notNull(),
    /** Parent department for hierarchical structure (self-reference) */
    parentDepartment: uuid('parent_department').references((): any => departments.id),
    /** Company this department belongs to. FK deferred: companies(id) */
    company: uuid('company'),
    /** Whether this is a group/category (has child departments) */
    isGroup: boolean('is_group').default(false).notNull(),
    /** Whether this department is disabled/inactive */
    disabled: boolean('disabled').default(false).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('departments_org_name_unique').on(table.orgId, table.departmentName),
    index('departments_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    // Frequently queried: search departments by name prefix
    index('departments_org_name_idx').on(table.orgId, table.departmentName),
    // Frequently queried: find child departments
    index('departments_org_parent_idx').on(table.orgId, table.parentDepartment),
    // Frequently queried: filter by company
    index('departments_org_company_idx').on(table.orgId, table.company),
    check('departments_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
