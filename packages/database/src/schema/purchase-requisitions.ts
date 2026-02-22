import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { moneyMinor } from '../helpers/field-types';
import { tenantPolicy } from '../helpers/tenant-policy';

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
    totalAmountMinor: moneyMinor('total_amount_minor'),
    currency: text('currency').notNull().default('MYR'),
    prLines: jsonb('pr_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('purchase_requisitions_org_id_idx').on(table.orgId, table.id),
    index('purchase_requisitions_org_created_idx').on(table.orgId, table.createdAt),
    check('purchase_requisitions_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('purchase_requisitions_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type PurchaseRequisition = typeof purchaseRequisitions.$inferSelect;
export type NewPurchaseRequisition = typeof purchaseRequisitions.$inferInsert;
