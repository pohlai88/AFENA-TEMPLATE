/**
 * stableCanonicalJson — deterministic JSON serialization for hash inputs.
 *
 * Rules:
 * - Object keys sorted recursively (alphabetical)
 * - Numbers serialized as-is (no floating-point coercion)
 * - Dates normalized to ISO 8601 strings
 * - Arrays preserve order (sort is key-level only)
 *
 * RULE: All packages must use this utility when computing `inputsHash`.
 * Never use JSON.stringify(obj) directly — key order is not guaranteed.
 */
export function stableCanonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortKeys((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}
