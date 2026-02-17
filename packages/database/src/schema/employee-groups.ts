import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Employee Groups — employee categorization.
 * Source: employee-groups.spec.json (adopted from ERPNext Employee Group).
 * Master entity for grouping employees.
 */
export const employeeGroups = pgTable(
  'employee_groups',
  {
    ...erpEntityColumns,
    /** Employee group name (unique per organization) */
    employeeGroupName: text('employee_group_name').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('employee_groups_org_name_unique').on(table.orgId, table.employeeGroupName),
    index('employee_groups_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    // Frequently queried: search employee groups by name prefix
    index('employee_groups_org_name_idx').on(table.orgId, table.employeeGroupName),
    check('employee_groups_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type EmployeeGroup = typeof employeeGroups.$inferSelect;
export type NewEmployeeGroup = typeof employeeGroups.$inferInsert;
