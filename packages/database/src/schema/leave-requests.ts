import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { docStatusEnum } from '../helpers/doc-status';

export const leaveRequests = pgTable(
  'leave_requests',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    employeeId: uuid('employee_id').notNull(),
    leaveType: text('leave_type').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    days: numeric('days', { precision: 5, scale: 2 }),
    reason: text('reason'),
  },
  (table) => [
    index('leave_requests_org_id_idx').on(table.orgId, table.id),
    index('leave_requests_org_created_idx').on(table.orgId, table.createdAt),
    check('leave_requests_org_not_empty', sql`org_id <> ''`),
    check('leave_requests_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type NewLeaveRequest = typeof leaveRequests.$inferInsert;
