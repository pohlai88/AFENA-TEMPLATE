import { sql } from 'drizzle-orm';
import { boolean, check, date, foreignKey, index, integer, numeric, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Discount rules — deterministic discount evaluation for pricing engine.
 *
 * RULE C-01: Discount rules are LEGAL-scoped (company-specific discount policies).
 * PRD G0.16:
 * - Stacking rules: whether discounts compound or are exclusive
 * - Precedence order for evaluation
 * - Time-bounded: effective_from / effective_to
 * - Scope: customer-specific, product-specific, or global
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const discountRules = pgTable(
  'discount_rules',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id'),
    code: text('code').notNull(),
    name: text('name').notNull(),
    discountType: text('discount_type').notNull().default('percentage'),
    discountValue: numeric('discount_value', { precision: 20, scale: 6 }).notNull(),
    scope: text('scope').notNull().default('global'),
    customerId: uuid('customer_id'),
    productId: uuid('product_id'),
    productGroupCode: text('product_group_code'),
    priceListId: uuid('price_list_id'),
    precedence: integer('precedence').notNull().default(100),
    stackable: boolean('stackable').notNull().default(false),
    effectiveFrom: date('effective_from'),
    effectiveTo: date('effective_to'),
    isActive: boolean('is_active').notNull().default(true),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'discount_rules_company_fk',
    }).onDelete('cascade'),
    index('disc_rules_org_id_idx').on(table.orgId, table.id),
    index('disc_rules_scope_idx').on(table.orgId, table.scope),
    index('disc_rules_customer_idx').on(table.orgId, table.customerId),
    index('disc_rules_product_idx').on(table.orgId, table.productId),
    index('disc_rules_precedence_idx').on(table.orgId, table.precedence),
    check('disc_rules_org_not_empty', sql`org_id <> ''`),
    check('disc_rules_type_valid', sql`discount_type IN ('percentage', 'fixed_amount', 'buy_x_get_y')`),
    check('disc_rules_scope_valid', sql`scope IN ('global', 'customer', 'product', 'product_group', 'price_list')`),
    check('disc_rules_value_non_negative', sql`discount_value >= 0`),
    check('disc_rules_date_order', sql`effective_to IS NULL OR effective_from IS NULL OR effective_from <= effective_to`),
    tenantPolicy(table),
  ],
);

export type DiscountRule = typeof discountRules.$inferSelect;
export type NewDiscountRule = typeof discountRules.$inferInsert;
