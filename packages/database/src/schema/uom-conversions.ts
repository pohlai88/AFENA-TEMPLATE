import { sql } from 'drizzle-orm';
import { check, index, numeric, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const uomConversions = pgTable(
  'uom_conversions',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    fromUomId: uuid('from_uom_id').notNull(),
    toUomId: uuid('to_uom_id').notNull(),
    factor: numeric('factor', { precision: 20, scale: 10 }).notNull(),
  },
  (table) => [
    tenantPk(table),
    index('uom_conversions_org_id_idx').on(table.orgId, table.id),
    check('uom_conversions_org_not_empty', sql`org_id <> ''`),
    uniqueIndex('uom_conversions_org_from_to_uniq').on(
      table.orgId,
      table.fromUomId,
      table.toUomId,
    ),
    tenantPolicy(table),
  ],
);

export type UomConversion = typeof uomConversions.$inferSelect;
export type NewUomConversion = typeof uomConversions.$inferInsert;
