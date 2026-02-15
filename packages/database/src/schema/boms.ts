import { sql } from 'drizzle-orm';
import { boolean, check, foreignKey, index, integer, numeric, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Bills of Materials (BOMs) — manufacturing recipe definitions.
 *
 * RULE C-01: BOMs are OPERATIONS-scoped (company defines manufacturing recipes).
 * PRD Phase E #19 + G0.21:
 * - Links finished product to component materials
 * - Versioned: changes create new BOM versions, not edits
 * - UNIQUE(org_id, company_id, product_id, version)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const boms = pgTable(
  'boms',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    productId: uuid('product_id').notNull(),
    bomVersion: integer('bom_version').notNull().default(1),
    name: text('name').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    yieldQty: numeric('yield_qty', { precision: 20, scale: 6 }).notNull().default('1'),
    yieldUomId: uuid('yield_uom_id'),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'boms_company_fk',
    }),
    index('boms_org_id_idx').on(table.orgId, table.id),
    index('boms_product_idx').on(table.orgId, table.companyId, table.productId),
    uniqueIndex('boms_org_company_product_ver_uniq').on(
      table.orgId,
      table.companyId,
      table.productId,
      table.bomVersion,
    ),
    check('boms_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Bom = typeof boms.$inferSelect;
export type NewBom = typeof boms.$inferInsert;

/**
 * BOM lines — individual components within a BOM.
 */
export const bomLines = pgTable(
  'bom_lines',
  {
    ...baseEntityColumns,
    bomId: uuid('bom_id').notNull(),
    componentProductId: uuid('component_product_id').notNull(),
    qty: numeric('qty', { precision: 20, scale: 6 }).notNull(),
    uomId: uuid('uom_id'),
    wastePercent: numeric('waste_percent', { precision: 5, scale: 2 }).notNull().default('0'),
    isOptional: boolean('is_optional').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    memo: text('memo'),
  },
  (table) => [
    index('bom_lines_org_id_idx').on(table.orgId, table.id),
    index('bom_lines_bom_idx').on(table.orgId, table.bomId),
    index('bom_lines_component_idx').on(table.orgId, table.componentProductId),
    check('bom_lines_org_not_empty', sql`org_id <> ''`),
    check('bom_lines_qty_positive', sql`qty > 0`),
    tenantPolicy(table),
  ],
);

export type BomLine = typeof bomLines.$inferSelect;
export type NewBomLine = typeof bomLines.$inferInsert;
