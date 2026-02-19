import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const opportunities = pgTable(
  'opportunities',
  {
    ...erpEntityColumns,

    name: text('name').notNull(),
    accountName: text('account_name'),
    amount: numeric('amount', { precision: 18, scale: 2 }),
    stage: text('stage').notNull().default('prospecting'),
    probability: integer('probability'),
    expectedCloseDate: date('expected_close_date'),
    assignedTo: text('assigned_to'),
    details: jsonb('details').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    index('opportunities_org_id_idx').on(table.orgId, table.id),
    index('opportunities_org_created_idx').on(table.orgId, table.createdAt),
    check('opportunities_org_not_empty', sql`org_id <> ''`),

    tenantPolicy(table),
  ],
);

export type Opportunity = typeof opportunities.$inferSelect;
export type NewOpportunity = typeof opportunities.$inferInsert;
