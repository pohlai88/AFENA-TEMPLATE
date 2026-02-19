import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { docStatusEnum } from '../helpers/doc-status';

export const purchaseRequisitions = pgTable(
  'purchase_requisitions',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    prNumber: text('pr_number'),
    requestorId: uuid('requestor_id').notNull(),
    requestDate: date('request_date'),
    requiredDate: date('required_date'),
    totalAmount: numeric('total_amount', { precision: 18, scale: 2 }),
    currency: text('currency').notNull().default('MYR'),
    prLines: jsonb('pr_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    index('purchase_requisitions_org_id_idx').on(table.orgId, table.id),
    index('purchase_requisitions_org_created_idx').on(table.orgId, table.createdAt),
    check('purchase_requisitions_org_not_empty', sql`org_id <> ''`),
    check('purchase_requisitions_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type PurchaseRequisition = typeof purchaseRequisitions.$inferSelect;
export type NewPurchaseRequisition = typeof purchaseRequisitions.$inferInsert;
