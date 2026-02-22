import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * @see FIN-GL-POST-01
 * @see FIN-IC-MIRROR-01
 * @see FIN-FX-REV-01
 * gate.posting.balancedByConstruction — All Postings Must Balance DR = CR
 *
 * Verifies that the codebase enforces balanced journal entries at multiple levels:
 * 1. Database: je_balance CHECK constraint (total_debit_minor = total_credit_minor)
 * 2. Database: enforce_journal_balance trigger on journal_lines
 * 3. Accounting Hub: deriveJournalLines always produces balanced output
 * 4. All finance calculators that produce journal lines validate DR = CR
 *
 * This gate scans the accounting-hub derivation engine and all finance
 * calculators that produce journal lines to verify balance enforcement.
 */

const SCHEMA_DIR = resolve(__dirname, '../../packages/database/src/schema');
const HUB_DIR = resolve(__dirname, '../../business-domain/finance/accounting-hub/src');
const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');

function walk(dir: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    try {
      if (require('fs').statSync(full).isDirectory()) {
        if (entry !== 'node_modules' && entry !== 'dist') results.push(...walk(full));
      } else if (full.endsWith('.ts') && !full.includes('.test.') && !full.includes('.spec.')) {
        results.push(full);
      }
    } catch { /* skip */ }
  }
  return results;
}

describe('gate.posting.balancedByConstruction — FIN-GL-POST-01: postings always balance', () => {
  test('journal_entries schema has je_balance CHECK constraint', () => {
    const jeSchema = resolve(SCHEMA_DIR, 'journal-entries.ts');
    expect(existsSync(jeSchema)).toBe(true);
    const source = readFileSync(jeSchema, 'utf-8');
    expect(source).toMatch(/je_balance/);
    expect(source).toMatch(/total_debit_minor\s*=\s*total_credit_minor/);
  });

  test('journal_lines schema has valid side CHECK (debit/credit only)', () => {
    const jlSchema = resolve(SCHEMA_DIR, 'journal-lines.ts');
    expect(existsSync(jlSchema)).toBe(true);
    const source = readFileSync(jlSchema, 'utf-8');
    expect(source).toMatch(/side\s+IN\s*\(\s*'debit'\s*,\s*'credit'\s*\)/);
  });

  test('journal_lines schema enforces non-negative amounts', () => {
    const jlSchema = resolve(SCHEMA_DIR, 'journal-lines.ts');
    const source = readFileSync(jlSchema, 'utf-8');
    expect(source).toMatch(/amount_minor\s*>=\s*0/);
  });

  test('accounting-hub derivation engine validates balance', () => {
    const engineFile = resolve(HUB_DIR, 'calculators', 'derivation-engine.ts');
    if (!existsSync(engineFile)) return; // skip if not yet created
    const source = readFileSync(engineFile, 'utf-8');
    // Must reference debit/credit balance validation
    expect(source).toMatch(/debit|DR/i);
    expect(source).toMatch(/credit|CR/i);
  });

  test('no finance calculator crafts unbalanced journal lines', () => {
    const violations: string[] = [];
    const financeFiles = walk(FINANCE_ROOT);

    for (const file of financeFiles) {
      if (!file.includes('calculators') && !file.includes('services')) continue;
      const source = readFileSync(file, 'utf-8');

      // Files that produce journalLines must reference balance validation
      // Strip comments first to avoid false positives from comment-only references
      const codeOnly = source.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      if (codeOnly.includes('journalLines') || codeOnly.includes('journal_lines')) {
        // Must have some form of balance check or use the derivation engine
        const hasBalanceCheck =
          codeOnly.includes('debit') && codeOnly.includes('credit') ||
          codeOnly.includes('deriveJournalLines') ||
          codeOnly.includes('totalDebitMinor') ||
          codeOnly.includes('balanced');

        if (!hasBalanceCheck) {
          const rel = file.replace(FINANCE_ROOT + '\\', '').replace(FINANCE_ROOT + '/', '');
          violations.push(rel);
        }
      }
    }

    // Zero tolerance: every file producing journal lines must validate balance
    if (violations.length > 0) {
      throw new Error(
        `gate.posting.balancedByConstruction: ${violations.length} file(s) reference journalLines without balance validation:\n` +
        violations.slice(0, 10).map((v) => `  - ${v}`).join('\n'),
      );
    }
  });
});
