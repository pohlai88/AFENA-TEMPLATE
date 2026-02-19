import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const boms = pgTable(
  'boms',
  {
    ...erpEntityColumns,

    code: text('code').notNull(),
    name: text('name').notNull(),
    productId: uuid('product_id').notNull(),
    version: integer('version').notNull().default(1),
    isActive: text('is_active').notNull().default('true'),
    bomLines: jsonb('bom_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    index('boms_org_id_idx').on(table.orgId, table.id),
    index('boms_org_created_idx').on(table.orgId, table.createdAt),
    check('boms_org_not_empty', sql`org_id <> ''`),

    tenantPolicy(table),
  ],
);

export type Bom = typeof boms.$inferSelect;
export type NewBom = typeof boms.$inferInsert;
