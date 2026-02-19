import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, numeric, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const contracts = pgTable(
  'contracts',
  {
    ...erpEntityColumns,

    contractNumber: text('contract_number').notNull(),
    title: text('title').notNull(),
    partyA: text('party_a').notNull(),
    partyB: text('party_b').notNull(),
    startDate: date('start_date'),
    endDate: date('end_date'),
    value: numeric('value', { precision: 18, scale: 2 }),
    status: text('status').notNull().default('draft'),
    terms: jsonb('terms').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('contracts_org_id_idx').on(table.orgId, table.id),
    index('contracts_org_created_idx').on(table.orgId, table.createdAt),
    check('contracts_org_not_empty', sql`org_id <> ''`),

    tenantPolicy(table),
  ],
);

export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
