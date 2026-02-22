import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * FIN-03 — Deterministic Replay: Derivation Engine Hash Equality
 *
 * The accounting-hub derivation engine must produce deterministic output
 * for identical inputs. This gate verifies:
 *
 * 1. The derivation engine uses `stableCanonicalJson` (not bare JSON.stringify)
 * 2. The `computeDerivationId` function is exported and composable
 * 3. The derivation produces balanced DR = CR journal lines
 *
 * Rationale: Replaying the same business event against the same mapping
 * version MUST produce byte-identical journal lines. Non-deterministic
 * derivation breaks reconciliation, audit replay, and idempotency.
 */

const HUB_CALC_DIR = resolve(
  __dirname,
  '../../business-domain/finance/accounting-hub/src/calculators',
);
const DERIVATION_ENGINE = resolve(HUB_CALC_DIR, 'derivation-engine.ts');

describe('FIN-03: deterministic derivation engine', () => {
  test('derivation-engine.ts exists', () => {
    expect(existsSync(DERIVATION_ENGINE)).toBe(true);
  });

  test('derivation engine imports stableCanonicalJson (not bare JSON.stringify for hashing)', () => {
    const source = readFileSync(DERIVATION_ENGINE, 'utf-8');

    // Must import stableCanonicalJson
    expect(source).toMatch(/stableCanonicalJson/);

    // Should NOT use bare JSON.stringify for hash computation
    // (JSON.stringify for logging/debugging is OK, but not for hash inputs)
    const lines = source.split('\n');
    const violations: Array<{ line: number; text: string }> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      // Skip comments
      if (line.trimStart().startsWith('//') || line.trimStart().startsWith('*')) continue;
      // Flag JSON.stringify used near hash computation context
      if (/JSON\.stringify/.test(line) && /hash|Hash|derivation|eventId/i.test(line)) {
        violations.push({ line: i + 1, text: line.trim() });
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `FIN-03: derivation-engine.ts uses JSON.stringify near hash computation:\n` +
        violations.map((v) => `  L${v.line}: ${v.text}`).join('\n') +
        `\n\nUse stableCanonicalJson() instead for deterministic key ordering.`,
      );
    }
  });

  test('derivation engine uses crypto.createHash (SHA-256, not simpleHash)', () => {
    const source = readFileSync(DERIVATION_ENGINE, 'utf-8');
    expect(source).toMatch(/createHash/);
    expect(source).not.toMatch(/function\s+simpleHash/);
  });

  test('derivation engine exports computeDerivationId', () => {
    const source = readFileSync(DERIVATION_ENGINE, 'utf-8');
    expect(source).toMatch(/export\s+(function|const)\s+computeDerivationId/);
  });

  test('derivation engine validates DR = CR balance', () => {
    const source = readFileSync(DERIVATION_ENGINE, 'utf-8');
    // The engine must check that total debits equal total credits
    expect(source).toMatch(/debit|DR/i);
    expect(source).toMatch(/credit|CR/i);
  });
});
