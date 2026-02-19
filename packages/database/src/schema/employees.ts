import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const employees = pgTable(
  'employees',
  {
    ...erpEntityColumns,
    code: text('code').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email'),
    phone: text('phone'),
    department: text('department'),
    position: text('position'),
    hireDate: date('hire_date'),
    terminationDate: date('termination_date'),
    employmentStatus: text('employment_status').notNull().default('active'),
    personalInfo: jsonb('personal_info').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('employees_org_id_idx').on(table.orgId, table.id),
    index('employees_org_code_idx').on(table.orgId, table.code),
    index('employees_org_created_idx').on(table.orgId, table.createdAt),
    check('employees_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
