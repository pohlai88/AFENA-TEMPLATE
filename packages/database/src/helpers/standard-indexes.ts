import { sql } from 'drizzle-orm';
import { check, index, uniqueIndex } from 'drizzle-orm/pg-core';

import { tenantPk } from './tenant-pk';
import { tenantPolicy } from './tenant-policy';

import type { PgColumn } from 'drizzle-orm/pg-core';

/**
 * Standard indexes, CHECK, composite PK, and RLS for every ERP entity table.
 *
 * Generates:
 * - Composite PK (org_id, id)
 * - (org_id, id) index
 * - (org_id, created_at) index
 * - org_id not empty CHECK
 * - tenantPolicy RLS
 *
 * Usage:
 * ```ts
 * export const products = pgTable(
 *   'products',
 *   { ...erpEntityColumns, name: text('name').notNull() },
 *   (t) => [...erpIndexes('products', t)],
 * );
 * ```
 */
export function erpIndexes(
  tableName: string,
  table: { orgId: PgColumn; id: PgColumn; createdAt: PgColumn },
) {
  return [
    tenantPk(table),
    index(`${tableName}_org_id_idx`).on(table.orgId, table.id),
    index(`${tableName}_org_created_idx`).on(table.orgId, table.createdAt),
    check(`${tableName}_org_not_empty`, sql`org_id <> ''`),
    tenantPolicy(table),
  ];
}

/**
 * Document table indexes — extends erpIndexes with doc number uniqueness.
 *
 * Generates everything from `erpIndexes` plus:
 * - Unique index (org_id, doc_no)
 *
 * Usage:
 * ```ts
 * export const invoices = pgTable(
 *   'invoices',
 *   { ...docEntityColumns, docNo: text('doc_no').notNull() },
 *   (t) => [...docIndexes('invoices', t)],
 * );
 * ```
 */
export function docIndexes(
  tableName: string,
  table: {
    orgId: PgColumn;
    id: PgColumn;
    createdAt: PgColumn;
    docNo: PgColumn;
  },
) {
  return [
    ...erpIndexes(tableName, table),
    uniqueIndex(`${tableName}_org_doc_no_idx`).on(table.orgId, table.docNo),
  ];
}
