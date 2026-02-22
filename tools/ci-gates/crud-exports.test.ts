import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * G-CRUD-01 — Export Surface CI Gate (Static Analysis)
 *
 * Enforces K-05: afenda-crud MUST export ONLY the approved kernel symbols.
 * Parses packages/crud/src/index.ts statically — no build or dist required.
 *
 * To add a new export:
 *   1. Confirm it belongs in the KERNEL surface (mutate, read, context, types, errors)
 *   2. Add it to APPROVED_VALUE_EXPORTS or APPROVED_TYPE_EXPORTS below
 *   3. Update the integration plan success criteria
 */

const INDEX_PATH = resolve(__dirname, '../../packages/crud/src/index.ts');

/**
 * Approved runtime-visible value exports (functions + constants).
 * Types are stripped at compile time and do NOT count toward K-05 limit.
 */
const APPROVED_VALUE_EXPORTS = [
  'mutate',
  'readEntity',
  'listEntities',
  'buildSystemContext',
  'buildUserContext',
  'KERNEL_ERROR_CODES',
  'setObservabilityHooks',
];

/**
 * Approved type-only exports (erased at runtime, listed for documentation).
 * These do NOT count toward the K-05 ≤10 limit.
 */
const APPROVED_TYPE_EXPORTS = [
  'MutationContext',
  'MutationSpec',
  'ApiResponse',
  'MutationReceipt',
  'KernelErrorCode',
  'ObservabilityHooks',
];

/**
 * Parse the index.ts source and extract exported name lists.
 * Handles:
 *   export { a, b } from '...'         → value exports
 *   export type { X, Y } from '...'    → type-only exports
 *   export type X = ...                → type-only exports
 */
function parseIndexExports(source: string): { values: string[]; types: string[] } {
  const values: string[] = [];
  const types: string[] = [];

  // Match: export { name1, name2 } from '...'
  const valueExportRe = /^export\s*\{([^}]+)\}\s+from\s+['"][^'"]+['"]/gm;
  // Match: export type { name1, name2 } from '...'
  const typeExportRe = /^export\s+type\s*\{([^}]+)\}\s+from\s+['"][^'"]+['"]/gm;

  let match: RegExpExecArray | null;

  // Extract type exports first (so we can skip them from value pass)
  const typeBlocks: string[] = [];
  while ((match = typeExportRe.exec(source)) !== null) {
    typeBlocks.push(match[0]);
    for (const name of match[1]!.split(',')) {
      const clean = name.trim().replace(/\s+as\s+\S+/, '').trim();
      if (clean) types.push(clean);
    }
  }

  // Extract value exports, skipping lines that are type exports
  while ((match = valueExportRe.exec(source)) !== null) {
    if (typeBlocks.some((tb) => source.slice(match!.index, match!.index + tb.length) === tb)) {
      continue; // skip — already counted as type
    }
    // Check if this specific match starts with 'export type'
    const lineStart = source.lastIndexOf('\n', match.index) + 1;
    const linePrefix = source.slice(lineStart, match.index + 6);
    if (linePrefix.includes('export type')) continue;

    for (const name of match[1]!.split(',')) {
      const clean = name.trim().replace(/\s+as\s+\S+/, '').trim();
      if (clean) values.push(clean);
    }
  }

  return { values, types };
}

describe('G-CRUD-01: afenda-crud export surface (K-05) — static analysis', () => {
  const source = readFileSync(INDEX_PATH, 'utf-8');
  const { values, types } = parseIndexExports(source);

  test('index.ts exists and is non-empty', () => {
    expect(source.trim().length).toBeGreaterThan(0);
  });

  test('value exports match approved list exactly', () => {
    expect(values.sort()).toEqual(APPROVED_VALUE_EXPORTS.sort());
  });

  test('type exports match approved list exactly', () => {
    expect(types.sort()).toEqual(APPROVED_TYPE_EXPORTS.sort());
  });

  test('total runtime value exports does not exceed 10 (K-05)', () => {
    expect(values.length).toBeLessThanOrEqual(10);
  });

  test('no unapproved value exports sneak in', () => {
    const unapproved = values.filter((v) => !APPROVED_VALUE_EXPORTS.includes(v));
    expect(unapproved).toEqual([]);
  });
});

