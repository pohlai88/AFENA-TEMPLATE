/**
 * CIG-02: FX Arithmetic Safety Gate
 *
 * AST-lite scan of FX calculator files to detect native float arithmetic
 * on rate-related identifiers. All rate math must use Decimal.js.
 *
 * Targets identifiers matching /rate|bid|ask|cross|spread/i in binary
 * expressions using *, /, +, - operators (outside Decimal method chains).
 *
 * @see oss-finance-ext.md §5 CIG-02, AD-13
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const FX_CALC_DIR = resolve(
  __dirname,
  '../../business-domain/finance/fx-management/src/calculators',
);

const RATE_IDENT = /\b(rate|bid|ask|cross|spread|vehicleTo|sourceTo)\w*/i;

/**
 * Detects lines with native float arithmetic on rate-related variables.
 * Heuristic: line contains a rate identifier AND a native arithmetic operator
 * AND does NOT use Decimal method chains (.mul, .div, .plus, .minus, .toDecimalPlaces).
 */
function detectFloatArithmetic(
  content: string,
  filePath: string,
): string[] {
  const violations: string[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip comments, imports, type definitions, string literals
    if (
      line.startsWith('//') ||
      line.startsWith('*') ||
      line.startsWith('import ') ||
      line.startsWith('export type') ||
      line.startsWith('type ') ||
      /['"`]/.test(line) && !RATE_IDENT.test(line.replace(/['"`][^'"`]*['"`]/g, ''))
    ) {
      continue;
    }

    // Check if line references a rate-related identifier
    if (!RATE_IDENT.test(line)) continue;

    // Check for native arithmetic operators on rate values
    // Pattern: rateVar * something, something / rateVar, etc.
    const hasNativeArith =
      /\b\w*(rate|bid|ask|cross|spread)\w*\s*[*\/+\-]\s*\w/i.test(line) ||
      /\w\s*[*\/+\-]\s*\w*(rate|bid|ask|cross|spread)\w*/i.test(line);

    // Check if it's using Decimal methods (safe)
    const hasDecimalMethod =
      /\.mul\(|\.div\(|\.plus\(|\.minus\(|\.toDecimalPlaces\(|new\s+Decimal\(|\.gt\(|\.lt\(|\.eq\(/i.test(
        line,
      );

    // Violation: native arithmetic on rate identifiers without Decimal
    if (hasNativeArith && !hasDecimalMethod) {
      const basename = filePath.replace(/^.*[\\/]/, '');
      violations.push(`${basename}:${i + 1} — ${line}`);
    }
  }

  return violations;
}

describe('gate.fx-precision — CIG-02', () => {
  it('finds FX calculator files to scan', () => {
    const files = readdirSync(FX_CALC_DIR).filter((f) => f.endsWith('.ts'));
    expect(files.length).toBeGreaterThan(0);
  });

  it('no native float arithmetic on rate identifiers in FX calculators', () => {
    const files = readdirSync(FX_CALC_DIR)
      .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
      .map((f) => join(FX_CALC_DIR, f));

    const allViolations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const violations = detectFloatArithmetic(content, file);
      allViolations.push(...violations);
    }

    expect(
      allViolations,
      `Native float arithmetic on rate variables:\n${allViolations.join('\n')}`,
    ).toHaveLength(0);
  });
});
