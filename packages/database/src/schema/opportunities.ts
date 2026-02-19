import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { moneyMinor } from '../helpers/field-types';
import { tenantPolicy } from '../helpers/tenant-policy';

export const opportunities = pgTable(
  'opportunities',
  {
    ...erpEntityColumns,

    name: text('name').notNull(),
    accountName: text('account_name'),
    amountMinor: moneyMinor('amount_minor'),
    stage: text('stage').notNull().default('prospecting'),
    probability: integer('probability'),
    expectedCloseDate: date('expected_close_date'),
    assignedTo: text('assigned_to'),
    details: jsonb('details').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('opportunities_org_id_idx').on(table.orgId, table.id),
    index('opportunities_org_created_idx').on(table.orgId, table.createdAt),
    check('opportunities_org_not_empty', sql`org_id <> ''`),

    tenantPolicy(table),
  ],
);

export type Opportunity = typeof opportunities.$inferSelect;
export type NewOpportunity = typeof opportunities.$inferInsert;
