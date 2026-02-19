import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { docStatusEnum } from '../helpers/doc-status';

export const leases = pgTable(
  'leases',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    leaseNumber: text('lease_number'),
    lessor: text('lessor').notNull(),
    lessee: text('lessee').notNull(),
    startDate: date('start_date'),
    endDate: date('end_date'),
    monthlyPayment: numeric('monthly_payment', { precision: 18, scale: 2 }),
    leaseType: text('lease_type').notNull(),
    leaseTerms: jsonb('lease_terms').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    index('leases_org_id_idx').on(table.orgId, table.id),
    index('leases_org_created_idx').on(table.orgId, table.createdAt),
    check('leases_org_not_empty', sql`org_id <> ''`),
    check('leases_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type Lease = typeof leases.$inferSelect;
export type NewLease = typeof leases.$inferInsert;
