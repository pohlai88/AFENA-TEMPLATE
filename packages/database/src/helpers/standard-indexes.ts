import { sql } from 'drizzle-orm';
import { check, index, uniqueIndex } from 'drizzle-orm/pg-core';

import { tenantPolicy } from './tenant-policy';

import type { PgColumn } from 'drizzle-orm/pg-core';

/**
 * Standard indexes + RLS for every ERP entity table.
 *
 * Generates:
 * - (org_id, id) index
 * - (org_id, created_at) index
 * - org_id not empty CHECK
 * - tenantPolicy RLS
 */
export function erpIndexes(
  tableName: string,
  table: { orgId: PgColumn; id: PgColumn; createdAt: PgColumn },
) {
  return [
    index(`${tableName}_org_id_idx`).on(table.orgId, table.id),
    index(`${tableName}_org_created_idx`).on(table.orgId, table.createdAt),
    check(`${tableName}_org_not_empty`, sql`org_id <> ''`),
    tenantPolicy(table),
  ];
}

/**
 * Document table indexes — extends erpIndexes with doc number uniqueness.
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
