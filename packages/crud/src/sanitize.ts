/**
 * K-11: Two-layer input sanitization.
 * Kernel backstop strips known system columns before dispatching to handler.
 * Entity handlers use allowlist (pick) as primary defense.
 */
const SYSTEM_COLUMNS = new Set([
  'id',
  'org_id',
  'orgId',
  'created_by',
  'createdBy',
  'updated_by',
  'updatedBy',
  'created_at',
  'createdAt',
  'updated_at',
  'updatedAt',
  'version',
  'is_deleted',
  'isDeleted',
  'deleted_at',
  'deletedAt',
  'deleted_by',
  'deletedBy',
  'search_vector',
  'searchVector',
]);

/** Strip system columns from input payload. Returns a new object. */
export function stripSystemColumns(input: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!SYSTEM_COLUMNS.has(key)) {
      result[key] = value;
    }
  }
  return result;
}
