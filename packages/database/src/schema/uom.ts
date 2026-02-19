import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const uom = pgTable(
  'uom',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    name: text('name').notNull(),
    symbol: text('symbol').notNull(),
    type: text('type').notNull(),
  },
  (table) => [
    tenantPk(table),
    index('uom_org_id_idx').on(table.orgId, table.id),
    check('uom_org_not_empty', sql`org_id <> ''`),
    check('uom_type_chk', sql`type IN ('weight','volume','length','area','count','time','custom')`),
    uniqueIndex('uom_org_symbol_uniq').on(table.orgId, table.symbol),
    tenantPolicy(table),
  ],
);

export type Uom = typeof uom.$inferSelect;
export type NewUom = typeof uom.$inferInsert;
