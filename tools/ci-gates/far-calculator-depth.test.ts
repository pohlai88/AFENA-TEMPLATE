/**
 * CIG-07: Calculator Depth Floor Gate
 *
 * Every finance domain package MUST have at least 5 calculator files
 * in `src/calculators/`. This ensures comprehensive IFRS/IAS coverage
 * per domain rather than thin single-calculator packages.
 *
 * @see finance-360-audit-943c40.md §1
 */
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');

const MIN_CALCULATORS = 5;

type PackageCalcInfo = {
  name: string;
  calculatorCount: number;
  calculatorFiles: string[];
};

function getFinancePackageCalculators(): PackageCalcInfo[] {
  const results: PackageCalcInfo[] = [];

  const dirs = readdirSync(FINANCE_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'node_modules' && d.name !== 'test-utils' && d.name !== 'test-helpers');

  for (const dir of dirs) {
    const calcDir = join(FINANCE_ROOT, dir.name, 'src', 'calculators');

    if (!existsSync(calcDir)) {
      results.push({ name: dir.name, calculatorCount: 0, calculatorFiles: [] });
      continue;
    }

    const calcFiles = readdirSync(calcDir).filter(
      (f) => f.endsWith('.ts') && !f.includes('.test.') && !f.includes('.spec.'),
    );

    results.push({
      name: dir.name,
      calculatorCount: calcFiles.length,
      calculatorFiles: calcFiles,
    });
  }

  return results.sort((a, b) => a.calculatorCount - b.calculatorCount);
}

describe('gate.calculator-depth — CIG-07', () => {
  const packages = getFinancePackageCalculators();

  it('finds finance packages', () => {
    expect(packages.length).toBeGreaterThan(0);
  });

  it(`every finance package has at least ${MIN_CALCULATORS} calculator files`, () => {
    const below = packages.filter((p) => p.calculatorCount < MIN_CALCULATORS);

    if (below.length > 0) {
      const detail = below
        .map((p) => `  ${p.name}: ${p.calculatorCount}/${MIN_CALCULATORS} (has: ${p.calculatorFiles.join(', ')})`)
        .join('\n');

      expect.fail(
        `${below.length} package(s) below minimum ${MIN_CALCULATORS} calculators:\n${detail}`,
      );
    }
  });

  it('no package has zero calculators', () => {
    const empty = packages.filter((p) => p.calculatorCount === 0);
    expect(empty.length, `Packages with 0 calculators: ${empty.map((p) => p.name).join(', ')}`).toBe(0);
  });
});
