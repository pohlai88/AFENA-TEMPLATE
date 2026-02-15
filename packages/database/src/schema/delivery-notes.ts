import { sql } from 'drizzle-orm';
import { check, foreignKey, index, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { postingColumns } from '../helpers/posting-columns';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Delivery notes — goods dispatch document.
 *
 * RULE C-01: Delivery notes are ISSUER-scoped (company dispatches goods).
 * Transactional Spine Migration 0035.
 * - 6-state posting_status (P-08)
 * - company_id NOT NULL (§3.12)
 * - warehouseId for stock movement trigger
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const deliveryNotes = pgTable(
  'delivery_notes',
  {
    ...docEntityColumns,
    ...postingColumns,
    docNo: text('doc_no'),
    customerId: uuid('customer_id').notNull(),
    warehouseId: uuid('warehouse_id'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'delivery_notes_company_fk',
    }),
    uniqueIndex('dn_org_doc_no_uniq').on(table.orgId, table.docNo),
    index('dn_org_customer_posting_idx').on(table.orgId, table.customerId, table.postingDate),
    index('dn_org_posting_date_idx').on(table.orgId, table.postingDate),
    index('dn_org_posting_status_idx').on(table.orgId, table.postingStatus, table.postingDate),
    check('dn_org_not_empty', sql`org_id <> ''`),
    check('dn_company_required', sql`company_id IS NOT NULL`),
    check(
      'dn_posting_status_valid',
      sql`posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed')`,
    ),
    tenantPolicy(table),
  ],
);

export type DeliveryNote = typeof deliveryNotes.$inferSelect;
export type NewDeliveryNote = typeof deliveryNotes.$inferInsert;
