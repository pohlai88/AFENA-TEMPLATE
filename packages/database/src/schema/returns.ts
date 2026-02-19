import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { moneyMinor } from '../helpers/field-types';
import { tenantPolicy } from '../helpers/tenant-policy';

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
    totalAmountMinor: moneyMinor('total_amount_minor'),
    currency: text('currency').notNull().default('MYR'),
    returnLines: jsonb('return_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('returns_org_id_idx').on(table.orgId, table.id),
    index('returns_org_created_idx').on(table.orgId, table.createdAt),
    check('returns_org_not_empty', sql`org_id <> ''`),
    check('returns_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type Return = typeof returns.$inferSelect;
export type NewReturn = typeof returns.$inferInsert;
