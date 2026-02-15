import { sql } from 'drizzle-orm';
import { bigint, check, foreignKey, index, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Purchase requests (requisitions) — internal approval step before POs.
 *
 * RULE C-01: Purchase requests are ISSUER-scoped (company requests purchases).
 * Audit P1-11:
 * - Referenced by budget_commitments.source_type CHECK ('purchase_request')
 * - Internal document for requesting procurement
 * - Requires approval before conversion to PO
 * - Uses docEntity lifecycle (draft → submitted → active → cancelled)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const purchaseRequests = pgTable(
  'purchase_requests',
  {
    ...docEntityColumns,
    requestNo: text('request_no'),
    requestedBy: text('requested_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    departmentId: uuid('department_id'),
    priority: text('priority').notNull().default('normal'),
    requiredByDate: text('required_by_date'),
    currencyCode: text('currency_code').notNull().default('MYR'),
    totalMinor: bigint('total_minor', { mode: 'number' }).notNull().default(0),
    approvedBy: text('approved_by'),
    approvedAt: text('approved_at'),
    convertedToPurchaseOrderId: uuid('converted_to_purchase_order_id'),
    reason: text('reason'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'purchase_requests_company_fk',
    }),
    index('pr_org_id_idx').on(table.orgId, table.id),
    index('pr_org_company_idx').on(table.orgId, table.companyId),
    index('pr_requested_by_idx').on(table.orgId, table.requestedBy),
    index('pr_status_idx').on(table.orgId, table.docStatus),
    uniqueIndex('pr_org_request_no_uniq')
      .on(table.orgId, table.requestNo)
      .where(sql`request_no IS NOT NULL`),
    check('pr_org_not_empty', sql`org_id <> ''`),
    check('pr_priority_valid', sql`priority IN ('low', 'normal', 'high', 'urgent')`),
    check('pr_total_non_negative', sql`total_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type PurchaseRequest = typeof purchaseRequests.$inferSelect;
export type NewPurchaseRequest = typeof purchaseRequests.$inferInsert;
