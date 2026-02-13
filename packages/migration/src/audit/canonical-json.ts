import { createHash } from 'node:crypto';

/**
 * AUD-06: Canonical JSON serialization for governance-grade hashing.
 *
 * - Deep sort keys
 * - Stable arrays (order preserved)
 * - No whitespace
 * - Undefined values stripped
 */
export function canonicalStringify(obj: unknown): string {
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';

  if (typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    const items = obj.map((item) => canonicalStringify(item));
    return `[${items.join(',')}]`;
  }

  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = keys
    .map((key) => {
      const value = (obj as Record<string, unknown>)[key];
      if (value === undefined) return null;
      return `${JSON.stringify(key)}:${canonicalStringify(value)}`;
    })
    .filter(Boolean);

  return `{${pairs.join(',')}}`;
}

export function hashCanonical(obj: unknown): string {
  const canonical = canonicalStringify(obj);
  return createHash('sha256').update(canonical).digest('hex');
}
