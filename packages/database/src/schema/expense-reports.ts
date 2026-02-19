import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { moneyMinor } from '../helpers/field-types';
import { tenantPolicy } from '../helpers/tenant-policy';

export const expenseReports = pgTable(
  'expense_reports',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    reportNumber: text('report_number'),
    employeeId: uuid('employee_id').notNull(),
    reportDate: date('report_date'),
    totalAmountMinor: moneyMinor('total_amount_minor'),
    currency: text('currency').notNull().default('MYR'),
    purpose: text('purpose'),
    expenseLines: jsonb('expense_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('expense_reports_org_id_idx').on(table.orgId, table.id),
    index('expense_reports_org_created_idx').on(table.orgId, table.createdAt),
    check('expense_reports_org_not_empty', sql`org_id <> ''`),
    check('expense_reports_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type ExpenseReport = typeof expenseReports.$inferSelect;
export type NewExpenseReport = typeof expenseReports.$inferInsert;
