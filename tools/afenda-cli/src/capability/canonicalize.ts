import { createHash } from 'crypto';

import type { DiscoveryOutput } from '../types';

/**
 * Recursively sort all object keys for deterministic JSON output.
 * Arrays are preserved in order (caller must pre-sort).
 */
function sortKeys(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(sortKeys);
  if (typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortKeys((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

/**
 * Sort all arrays and object keys in the discovery output for determinism.
 * Exclude `generatedAt` from the content hash (informational only).
 */
export function canonicalize(output: DiscoveryOutput): DiscoveryOutput {
  const canonical: DiscoveryOutput = {
    ...(output.generatedAt != null ? { generatedAt: output.generatedAt } : {}),
    signature: output.signature,
    contentHash: '', // computed below
    ungrouped: [...output.ungrouped].sort((a, b) =>
      a.source.localeCompare(b.source)
    ),
    missingReadmes: [...output.missingReadmes].sort(),
    staleReadmes: [...output.staleReadmes].sort(),
  };

  canonical.contentHash = computeContentHash(canonical);
  return canonical;
}

/**
 * Compute SHA-256 hash of the canonical payload (excluding generatedAt and contentHash).
 * Uses recursive key sorting for cross-platform determinism.
 */
export function computeContentHash(output: DiscoveryOutput): string {
  const payload = {
    signature: output.signature,
    ungrouped: output.ungrouped,
    missingReadmes: output.missingReadmes,
    staleReadmes: output.staleReadmes,
  };
  const json = JSON.stringify(sortKeys(payload));
  return `sha256:${createHash('sha256').update(json).digest('hex')}`;
}
