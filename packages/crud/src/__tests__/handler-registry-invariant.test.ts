/**
 * Gate 7 — Handler registry invariant.
 *
 * Every HANDLER_REGISTRY key must:
 * 1. Exist in TABLE_REGISTRY (database)
 * 2. Have table_kind in ALLOWED_HANDLER_KINDS
 *
 * Start with { truth, control }; extend when projection/evidence handlers are added.
 *
 * Uses file parsing to avoid loading afena-database (which requires DATABASE_URL).
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

import { getRegisteredHandlerMeta } from '../handler-meta';

type TableKind = 'truth' | 'control' | 'projection' | 'evidence' | 'link' | 'system';

const ALLOWED_HANDLER_KINDS = new Set<TableKind>(['truth', 'control']);

function parseTableRegistry(): Record<string, TableKind> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const registryPath = join(__dirname, '../../../database/src/schema/_registry.ts');
  const content = readFileSync(registryPath, 'utf-8');
  const match = content.match(/export const TABLE_REGISTRY = \{([^}]+)\}/s);
  expect(match).toBeTruthy();
  const body = match![1]!;
  const registry: Record<string, TableKind> = {};
  const lineRe = /^\s*([a-z_]+):\s*'([a-z_]+)',?\s*$/gm;
  let m;
  while ((m = lineRe.exec(body)) !== null) {
    registry[m[1]!] = m[2]! as TableKind;
  }
  return registry;
}

describe('Gate 7 — Handler registry invariant', () => {
  const handlerMeta = getRegisteredHandlerMeta();
  const handlerKeys = Array.from(handlerMeta.keys());
  const tableRegistry = parseTableRegistry();

  it('every handler key exists in TABLE_REGISTRY', () => {
    const missing = handlerKeys.filter((key) => !(key in tableRegistry));
    expect(
      missing,
      `Handler keys not in TABLE_REGISTRY: ${missing.join(', ')}. ` +
        'Add schema or run pnpm db:barrel.',
    ).toEqual([]);
  });

  it('every handler table_kind is in ALLOWED_HANDLER_KINDS', () => {
    const invalid: string[] = [];
    for (const key of handlerKeys) {
      const kind = tableRegistry[key];
      if (!kind || !ALLOWED_HANDLER_KINDS.has(kind)) {
        invalid.push(`${key} (${kind ?? 'unknown'})`);
      }
    }
    expect(
      invalid,
      `Handler tables with disallowed kind: ${invalid.join(', ')}. ` +
        'Either add to ALLOWED_HANDLER_KINDS or remove handler.',
    ).toEqual([]);
  });
});
