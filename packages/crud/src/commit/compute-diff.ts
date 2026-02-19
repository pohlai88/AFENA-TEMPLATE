import { compare, type Operation } from 'fast-json-patch';

/**
 * K-13: System columns excluded from diff by normalizing snapshots first.
 * Diff is display-only (Decision C).
 */
const SYSTEM_COLUMNS = new Set([
  'updated_at',
  'updatedAt',
  'search_vector',
  'searchVector',
]);

/** Strip system columns from a snapshot for diff normalization. */
function normalize(snapshot: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(snapshot)) {
    if (!SYSTEM_COLUMNS.has(key)) {
      result[key] = value;
    }
  }
  return result;
}

/** Generate RFC 6902 JSON Patch from normalized before/after snapshots. */
export function generateDiff(
  before: Record<string, unknown> | null,
  after: Record<string, unknown>,
): Operation[] | null {
  if (!before) return null;
  const normalizedBefore = normalize(before);
  const normalizedAfter = normalize(after);
  const ops = compare(normalizedBefore, normalizedAfter);
  return ops.length > 0 ? ops : null;
}
