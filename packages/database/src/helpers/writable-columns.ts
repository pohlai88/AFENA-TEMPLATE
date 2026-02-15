/**
 * GAP-DB-007 / SAN-01: Schema-derived writable columns.
 *
 * Extracts API-writable column names from Drizzle table schema.
 * Excludes system columns (id, org_id, created_at, etc.) that are
 * set by kernel or DB defaults.
 */

import { getTableColumns } from 'drizzle-orm';

import type { PgTable } from 'drizzle-orm/pg-core';

/** Columns set by kernel/DB — not writable from API input. */
const SYSTEM_COLUMNS = new Set([
  'id',
  'orgId',
  'org_id',
  'createdAt',
  'created_at',
  'updatedAt',
  'updated_at',
  'createdBy',
  'created_by',
  'updatedBy',
  'updated_by',
  'version',
  'isDeleted',
  'is_deleted',
  'deletedAt',
  'deleted_at',
  'deletedBy',
  'deleted_by',
  'searchVector',
  'search_vector',
]);

/**
 * Get writable column names from a Drizzle table (camelCase).
 * Use for pickAllowed replacement — SAN-01.
 */
export function getWritableColumns(table: PgTable): string[] {
  const cols = getTableColumns(table);
  return Object.keys(cols).filter((name) => !SYSTEM_COLUMNS.has(name));
}

/**
 * Pick only writable columns from input. Schema-derived allowlist.
 */
export function pickWritable<T extends Record<string, unknown>>(
  table: PgTable,
  input: T,
): Partial<T> {
  const allowed = new Set(getWritableColumns(table));
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (allowed.has(key)) {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}
