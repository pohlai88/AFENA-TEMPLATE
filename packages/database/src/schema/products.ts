import { sql } from 'drizzle-orm';
import { check, index, jsonb, numeric, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const products = pgTable(
  'products',
  {
    ...erpEntityColumns,
    code: text('code').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    category: text('category'),
    uom: text('uom').notNull().default('EA'),
    unitPrice: numeric('unit_price', { precision: 18, scale: 6 }),
    costPrice: numeric('cost_price', { precision: 18, scale: 6 }),
    taxCode: text('tax_code'),
    isActive: text('is_active').notNull().default('true'),
    specifications: jsonb('specifications').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    index('products_org_id_idx').on(table.orgId, table.id),
    index('products_org_code_idx').on(table.orgId, table.code),
    index('products_org_created_idx').on(table.orgId, table.createdAt),
    check('products_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
