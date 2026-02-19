import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { docStatusEnum } from '../helpers/doc-status';

export const returns = pgTable(
  'returns',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    returnNumber: text('return_number'),
    returnType: text('return_type').notNull(),
    returnDate: date('return_date'),
    reason: text('reason'),
    totalAmount: numeric('total_amount', { precision: 18, scale: 2 }),
    currency: text('currency').notNull().default('MYR'),
    returnLines: jsonb('return_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    index('returns_org_id_idx').on(table.orgId, table.id),
    index('returns_org_created_idx').on(table.orgId, table.createdAt),
    check('returns_org_not_empty', sql`org_id <> ''`),
    check('returns_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type Return = typeof returns.$inferSelect;
export type NewReturn = typeof returns.$inferInsert;
