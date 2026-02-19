/**
 * Drizzle Schema Allowlist Helper
 *
 * GAP-DB-007 / SAN-01: Derives the set of writable columns from a Drizzle
 * table definition and returns only the input keys that correspond to known
 * columns. This prevents injection of unknown fields and serves as a
 * schema-derived allowlist backstop.
 *
 * Usage (in entity handlers):
 *   import { pickWritable } from 'afenda-database';
 *   const safe = pickWritable(contacts, rawInput);
 */
import type { PgTable } from 'drizzle-orm/pg-core';

/**
 * System-managed columns that should never be set by user input.
 * Even if present in the schema, these are stripped from sanitized input.
 */
const SERVER_OWNED_COLUMNS = new Set<string>([
  'id',
  'org_id',
  'orgId',
  'created_at',
  'createdAt',
  'created_by',
  'createdBy',
  'version',
  'is_deleted',
  'isDeleted',
  'deleted_at',
  'deletedAt',
  'deleted_by',
  'deletedBy',
]);

/**
 * Pick only the keys from `input` that correspond to writable columns in
 * the Drizzle `table` definition, excluding server-owned system columns.
 *
 * @param table - A Drizzle PgTable (e.g. `contacts`, `companies`)
 * @param input - Raw mutation input record
 * @returns A new object containing only valid, writable column values
 */
export function pickWritable(
  table: PgTable,
  input: Record<string, unknown>,
): Record<string, unknown> {
  // Drizzle stores column definitions on the table object keyed by JS camelCase names
  const tableColumns = (table as unknown as { _: { columns: Record<string, unknown> } })
    ._?.columns ?? {};
  const knownKeys = new Set(Object.keys(tableColumns));

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    // Must be a known column in the table
    if (!knownKeys.has(key)) continue;
    // Must not be a server-owned column
    if (SERVER_OWNED_COLUMNS.has(key)) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Returns the set of writable column names for a Drizzle table.
 * Useful for building allowlists in tests and validators.
 */
export function getWritableColumnNames(table: PgTable): ReadonlySet<string> {
  const tableColumns = (table as unknown as { _: { columns: Record<string, unknown> } })
    ._?.columns ?? {};
  return new Set(
    Object.keys(tableColumns).filter((k) => !SERVER_OWNED_COLUMNS.has(k)),
  );
}
