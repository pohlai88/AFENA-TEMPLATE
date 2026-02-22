import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const recipes = pgTable(
  'recipes',
  {
    ...erpEntityColumns,

    code: text('code').notNull(),
    name: text('name').notNull(),
    productId: uuid('product_id').notNull(),
    version: integer('version').notNull().default(1),
    yieldQuantity: numeric('yield_quantity', { precision: 18, scale: 6 }),
    instructions: text('instructions'),
    ingredients: jsonb('ingredients').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('recipes_org_id_idx').on(table.orgId, table.id),
    index('recipes_org_created_idx').on(table.orgId, table.createdAt),
    check('recipes_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),

    tenantPolicy(table),
  ],
);

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
