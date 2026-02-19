import { primaryKey, foreignKey, index } from 'drizzle-orm/pg-core';

import type { PgColumn, PgTableWithColumns } from 'drizzle-orm/pg-core';

/**
 * Tenant Composite Primary Key Helper
 * 
 * Creates a composite PK (org_id, id) for tenant-isolated tables.
 * This is the "hard wall" for tenant isolation at the database level.
 * 
 * CRITICAL: Every tenant table MUST use this instead of standalone id PK.
 * 
 * Usage:
 *   pgTable('my_table', { ...baseEntityColumns, ... }, (t) => ({
 *     pk: tenantPk(t),
 *   }))
 */
export function tenantPk<T extends { orgId: PgColumn; id: PgColumn }>(t: T) {
  return primaryKey({ columns: [t.orgId, t.id] });
}

/**
 * Tenant Composite Foreign Key Helper
 * 
 * Creates a composite FK (org_id, fk_id) → (parent.org_id, parent.id).
 * This prevents cross-tenant joins at the database level.
 * 
 * CRITICAL: Every FK to a tenant table MUST be composite.
 * 
 * Usage:
 *   pgTable('boms', {
 *     orgId: uuid('org_id').notNull(),
 *     productId: uuid('product_id').notNull(),
 *   }, (t) => ({
 *     productFk: tenantFk(t, 'product', t.productId, products),
 *   }))
 * 
 * @param t - Table columns object
 * @param name - FK name prefix (e.g., 'product' → 'product_fk')
 * @param fkColumn - Local FK column (e.g., t.productId)
 * @param parentTable - Parent table reference
 * @param onDelete - FK action (default: 'restrict')
 */
export function tenantFk<
  T extends { orgId: PgColumn },
  P extends PgTableWithColumns<any>
>(
  t: T,
  name: string,
  fkColumn: PgColumn,
  parentTable: P,
  onDelete: 'restrict' | 'cascade' | 'set null' | 'no action' = 'restrict'
) {
  return foreignKey({
    name: `${name}_fk`,
    columns: [t.orgId, fkColumn],
    foreignColumns: [
      parentTable.orgId as PgColumn,
      parentTable.id as PgColumn,
    ],
  }).onDelete(onDelete);
}

/**
 * Tenant FK Index Helper
 * 
 * Creates an index on (org_id, fk_id) for composite FK lookups.
 * Required for every composite FK to maintain query performance.
 * 
 * Usage:
 *   pgTable('boms', { ... }, (t) => ({
 *     productFk: tenantFk(t, 'product', t.productId, products),
 *     productIdx: tenantFkIndex(t, 'product', t.productId),
 *   }))
 */
export function tenantFkIndex<T extends { orgId: PgColumn }>(
  t: T,
  name: string,
  fkColumn: PgColumn
) {
  return index(`${name}_org_fk_idx`).on(t.orgId, fkColumn);
}

/**
 * Complete Tenant FK Pattern
 * 
 * Combines FK + index in one helper for convenience.
 * 
 * Usage:
 *   pgTable('boms', { ... }, (t) => ({
 *     ...tenantFkPattern(t, 'product', t.productId, products),
 *   }))
 * 
 * Expands to:
 *   {
 *     productFk: foreignKey(...),
 *     productIdx: index(...),
 *   }
 */
export function tenantFkPattern<
  T extends { orgId: PgColumn },
  P extends PgTableWithColumns<any>
>(
  t: T,
  name: string,
  fkColumn: PgColumn,
  parentTable: P,
  onDelete: 'restrict' | 'cascade' | 'set null' | 'no action' = 'restrict'
) {
  return {
    [`${name}Fk`]: tenantFk(t, name, fkColumn, parentTable, onDelete),
    [`${name}Idx`]: tenantFkIndex(t, name, fkColumn),
  };
}
