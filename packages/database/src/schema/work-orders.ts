import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { docStatusEnum } from '../helpers/doc-status';

export const workOrders = pgTable(
  'work_orders',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    woNumber: text('wo_number'),
    productId: uuid('product_id').notNull(),
    quantity: numeric('quantity', { precision: 18, scale: 6 }).notNull().notNull(),
    startDate: date('start_date'),
    dueDate: date('due_date'),
    priority: text('priority').notNull().default('normal'),
    woLines: jsonb('wo_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    index('work_orders_org_id_idx').on(table.orgId, table.id),
    index('work_orders_org_created_idx').on(table.orgId, table.createdAt),
    check('work_orders_org_not_empty', sql`org_id <> ''`),
    check('work_orders_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type WorkOrder = typeof workOrders.$inferSelect;
export type NewWorkOrder = typeof workOrders.$inferInsert;
