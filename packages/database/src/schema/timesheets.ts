import { desc, sql } from 'drizzle-orm';
import { check, date, decimal, index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Timesheets — time tracking documents.
 * Source: timesheets.spec.json (adopted from ERPNext Timesheet).
 * Document entity for tracking time spent on projects and tasks.
 */
export const timesheets = pgTable(
  'timesheets',
  {
    ...erpEntityColumns,
    title: text('title'),
    namingSeries: text('naming_series').notNull(),
    company: uuid('company'),
    customer: uuid('customer'),
    currency: uuid('currency'),
    exchangeRate: decimal('exchange_rate', { precision: 18, scale: 6 }),
    salesInvoice: uuid('sales_invoice'),
    employee: uuid('employee'),
    employeeName: text('employee_name'),
    user: uuid('user_col'),
    startDate: date('start_date'),
    endDate: date('end_date'),
    totalHours: decimal('total_hours', { precision: 18, scale: 2 }),
    totalBillableHours: decimal('total_billable_hours', { precision: 18, scale: 2 }),
    totalBilledHours: decimal('total_billed_hours', { precision: 18, scale: 2 }),
    totalCostingAmount: decimal('total_costing_amount', { precision: 18, scale: 2 }),
    totalBillableAmount: decimal('total_billable_amount', { precision: 18, scale: 2 }),
    totalBilledAmount: decimal('total_billed_amount', { precision: 18, scale: 2 }),
    perBilled: decimal('per_billed', { precision: 18, scale: 2 }),
    statusCol: text('status_col'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('timesheets_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('timesheets_org_employee_idx').on(table.orgId, table.employee),
    index('timesheets_org_status_idx').on(table.orgId, table.statusCol),
    index('timesheets_org_start_date_idx').on(table.orgId, table.startDate),
    check('timesheets_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Timesheet = typeof timesheets.$inferSelect;
export type NewTimesheet = typeof timesheets.$inferInsert;
