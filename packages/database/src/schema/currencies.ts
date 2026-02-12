import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, numeric, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

export const currencies = pgTable(
  'currencies',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    code: text('code').notNull(),
    name: text('name').notNull(),
    symbol: text('symbol'),
    minorUnits: integer('minor_units').notNull().default(2),
    isBase: boolean('is_base').notNull().default(false),
    fxRateToBase: numeric('fx_rate_to_base', { precision: 20, scale: 10 }).default('1'),
    enabled: boolean('enabled').notNull().default(true),
  },
  (table) => [
    index('currencies_org_id_idx').on(table.orgId, table.id),
    check('currencies_org_not_empty', sql`org_id <> ''`),
    uniqueIndex('currencies_org_code_uniq').on(table.orgId, table.code),
    tenantPolicy(table),
  ],
);

export type Currency = typeof currencies.$inferSelect;
export type NewCurrency = typeof currencies.$inferInsert;
