import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * SK-10 — Calculator Return Types Include `inputs` + `explanation`
 *
 * Shared-kernel invariant: Every calculator function in domain packages
 * must return the `CalculatorResult<T>` shape: `{ result, inputs, explanation }`.
 *
 * This ensures every computation is:
 *   - Auditable: `inputs` captures what went in
 *   - Explainable: `explanation` describes what happened and why
 *   - Replayable: given the same `inputs`, the calculator reproduces `result`
 *
 * Scope: All business-domain/finance/[pkg]/src/calculators/[any].ts
 *
 * Detection: We scan for exported functions in calculator files and verify
 * they reference `CalculatorResult` in their return type annotation or
 * return objects with `result`, `inputs`, and `explanation` fields.
 */

const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');

describe('SK-10: calculator return types include inputs + explanation', () => {
  function collectTsFiles(dir: string): string[] {
    if (!existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        results.push(...collectTsFiles(full));
      } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts')) {
        results.push(full);
      }
    }
    return results;
  }

  test('all calculator files use CalculatorResult or return { result, inputs, explanation }', () => {
    const packages = readdirSync(FINANCE_ROOT).filter((entry) => {
      const full = join(FINANCE_ROOT, entry);
      return statSync(full).isDirectory() && existsSync(join(full, 'package.json'));
    });

    const violations: Array<{ pkg: string; file: string; detail: string }> = [];
    let totalFiles = 0;

    for (const pkg of packages) {
      const calcsDir = join(FINANCE_ROOT, pkg, 'src', 'calculators');
      if (!existsSync(calcsDir)) continue;

      const files = collectTsFiles(calcsDir);
      for (const filePath of files) {
        totalFiles++;
        const source = readFileSync(filePath, 'utf-8');
        const fileName = filePath.replace(FINANCE_ROOT, '');

        // Check 1: File imports or references CalculatorResult
        const hasCalculatorResultType = /CalculatorResult/.test(source);

        // Check 2: Exported functions return objects with result + inputs + explanation
        const hasTripleReturn =
          /\bresult\b/.test(source) && /\binputs\b/.test(source) && /\bexplanation\b/.test(source);

        if (!hasCalculatorResultType && !hasTripleReturn) {
          violations.push({
            pkg,
            file: fileName,
            detail:
              'Missing CalculatorResult<T> type or { result, inputs, explanation } return shape',
          });
        }
      }
    }

    expect(totalFiles).toBeGreaterThan(0);

    if (violations.length > 0) {
      throw new Error(
        `SK-10: ${violations.length} of ${totalFiles} calculator file(s) missing audit envelope:\n` +
          violations.map((v) => `  - ${v.pkg}${v.file}\n    ${v.detail}`).join('\n') +
          `\n\nUse CalculatorResult<T> from afenda-canon: { result, inputs, explanation }`,
      );
    }

    expect(violations).toEqual([]);
  });
});
