import { createHash } from 'node:crypto';

/**
 * Deterministic SHA-256 hex fingerprint for advisory deduplication.
 * INVARIANT-P03: open/ack advisories are deduplicated by (org_id, fingerprint).
 *
 * Canonicalization rules (locked):
 * - Pipe-delimited segments: orgId|type|entityType|entityId|windowStart|windowEnd|stableParams
 * - stableParams = stable JSON stringify (sorted keys, no whitespace, arrays preserve order)
 * - Output: 64-char lowercase hex string (validated by DB CHECK)
 */

/**
 * Stable JSON stringify with sorted keys, no whitespace, arrays preserve order.
 * Used for both fingerprint and evidence hash canonicalization.
 */
export function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']';
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const pairs = keys.map((k) => JSON.stringify(k) + ':' + stableStringify(obj[k]));
    return '{' + pairs.join(',') + '}';
  }
  return String(value);
}

/**
 * Compute SHA-256 hex hash of a string.
 */
export function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Build a deterministic advisory fingerprint.
 */
export function buildFingerprint(opts: {
  orgId: string;
  type: string;
  entityType?: string | null;
  entityId?: string | null;
  windowStart?: Date | null;
  windowEnd?: Date | null;
  params: Record<string, unknown>;
}): string {
  const segments = [
    opts.orgId,
    opts.type,
    opts.entityType ?? '',
    opts.entityId ?? '',
    opts.windowStart?.toISOString() ?? '',
    opts.windowEnd?.toISOString() ?? '',
    stableStringify(opts.params),
  ];
  return sha256Hex(segments.join('|'));
}
