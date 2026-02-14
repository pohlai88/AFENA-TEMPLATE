import { sql } from 'drizzle-orm';
import { check, index, integer, numeric, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * UOM conversions — deterministic unit-of-measure conversion with rounding rules.
 *
 * PRD Phase E #25 + G0.15:
 * - Conversion direction rounding (ceil/floor/half_up/half_down/banker)
 * - Per-product overrides via scope: 'global' or 'product'
 * - factor: multiply from_uom qty by factor to get to_uom qty
 * - UNIQUE(org_id, from_uom_id, to_uom_id, product_id) — allows product-specific overrides
 */
export const uomConversions = pgTable(
  'uom_conversions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    fromUomId: uuid('from_uom_id').notNull(),
    toUomId: uuid('to_uom_id').notNull(),
    factor: numeric('factor', { precision: 20, scale: 10 }).notNull(),
    roundingMethod: text('rounding_method').notNull().default('half_up'),
    roundingPrecision: integer('rounding_precision').notNull().default(6),
    scope: text('scope').notNull().default('global'),
    productId: uuid('product_id'),
  },
  (table) => [
    index('uom_conversions_org_id_idx').on(table.orgId, table.id),
    check('uom_conversions_org_not_empty', sql`org_id <> ''`),
    check('uom_conversions_rounding_valid', sql`rounding_method IN ('half_up', 'half_down', 'ceil', 'floor', 'banker')`),
    check('uom_conversions_scope_valid', sql`scope IN ('global', 'product')`),
    check('uom_conversions_factor_positive', sql`factor > 0`),
    check('uom_conversions_product_scope', sql`(scope = 'global' AND product_id IS NULL) OR (scope = 'product' AND product_id IS NOT NULL)`),
    uniqueIndex('uom_conversions_org_from_to_product_uniq').on(
      table.orgId,
      table.fromUomId,
      table.toUomId,
      table.productId,
    ),
    tenantPolicy(table),
  ],
);

export type UomConversion = typeof uomConversions.$inferSelect;
export type NewUomConversion = typeof uomConversions.$inferInsert;
