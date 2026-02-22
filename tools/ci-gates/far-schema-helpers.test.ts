/**
 * CIG-03: Schema Helper Consistency Gate
 *
 * Ensures finance schema files use canonical helpers (fxRate, moneyMinor)
 * instead of inline numeric definitions. Prevents I-01 class regressions.
 *
 * @see oss-finance-ext.md §5 CIG-03
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const SCHEMA_DIR = resolve(__dirname, '../../packages/database/src/schema');

const ALLOWLIST: string[] = [
  // Add files here with ADR justification if they legitimately need inline numeric
];

/** Pre-existing currency default violations — ratchet: count can decrease, never increase */
const CURRENCY_DEFAULT_RATCHET = 8;

/** Pre-existing inline rate violations — ratchet: count can decrease, never increase.
 * These are non-FX rate columns (interest rates, tax rates, WHT rates) that use
 * inline numeric because fxRate() semantics don't apply to them. */
const INLINE_RATE_RATCHET = 5;

function getSchemaFiles(): string[] {
  return readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== '_registry.ts')
    .map((f) => resolve(SCHEMA_DIR, f));
}

describe('gate.schema-helpers — CIG-03', () => {
  const files = getSchemaFiles();

  it('no inline numeric for FX rate columns where fxRate() exists', () => {
    const violations: string[] = [];

    for (const file of files) {
      const basename = file.replace(/^.*[\\/]/, '');
      if (ALLOWLIST.includes(basename)) continue;

      const content = readFileSync(file, 'utf-8');
      // Match inline numeric with 'rate' in the column name
      const inlineRatePattern = /numeric\s*\(\s*['"][^'"]*rate[^'"]*['"]/gi;
      const matches = content.match(inlineRatePattern);
      if (matches) {
        violations.push(`${basename}: found inline numeric for rate column — use fxRate() helper instead: ${matches.join(', ')}`);
      }
    }

    expect(
      violations.length,
      `Inline numeric rate columns found (ratchet: max ${INLINE_RATE_RATCHET}):\n${violations.join('\n')}`,
    ).toBeLessThanOrEqual(INLINE_RATE_RATCHET);
  });

  it('no currency columns with .default() on finance truth tables', () => {
    const violations: string[] = [];
    const financeTablePrefixes = [
      'journal-', 'acct-', 'fx-', 'ic-', 'consolidation-', 'posting-',
      'fiscal-', 'budget', 'cost-', 'revenue-', 'tax-', 'hedge-',
      'depreciation-', 'lease-', 'subscription-', 'expense-',
    ];

    for (const file of files) {
      const basename = file.replace(/^.*[\\/]/, '');
      const isFinanceTable = financeTablePrefixes.some((p) => basename.startsWith(p));
      if (!isFinanceTable) continue;

      const content = readFileSync(file, 'utf-8');
      // Match currency columns with .default()
      const currencyDefaultPattern = /(?:currency|currency_code).*\.default\s*\(/gi;
      const matches = content.match(currencyDefaultPattern);
      if (matches) {
        violations.push(`${basename}: currency column has .default() — currency must be explicit on finance truth tables`);
      }
    }

    expect(
      violations.length,
      `Currency defaults on finance tables (ratchet: max ${CURRENCY_DEFAULT_RATCHET}, found ${violations.length}):\n${violations.join('\n')}`,
    ).toBeLessThanOrEqual(CURRENCY_DEFAULT_RATCHET);
  });

  it('no inline numeric for amount columns where moneyMinor() exists', () => {
    const violations: string[] = [];

    for (const file of files) {
      const basename = file.replace(/^.*[\\/]/, '');
      if (ALLOWLIST.includes(basename)) continue;

      const content = readFileSync(file, 'utf-8');
      // Match inline numeric with 'amount' in the column name
      const inlineAmountPattern = /numeric\s*\(\s*['"][^'"]*amount[^'"]*['"]/gi;
      const matches = content.match(inlineAmountPattern);
      if (matches) {
        violations.push(`${basename}: found inline numeric for amount column — use moneyMinor() helper instead: ${matches.join(', ')}`);
      }
    }

    expect(violations, `Inline numeric amount columns found:\n${violations.join('\n')}`).toHaveLength(0);
  });
});
