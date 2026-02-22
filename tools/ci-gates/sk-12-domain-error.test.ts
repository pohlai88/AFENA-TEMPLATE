/**
 * CIG-01: DomainError Enforcement Gate
 *
 * Scans finance domain source files for raw `throw new Error(` patterns.
 * All throws must use DomainError from @afenda/canon with stable error codes.
 *
 * Excludes test files to avoid false positives from test setup code.
 * Lines with `// ADR:` comments are allowed (must cite decision number).
 *
 * @see oss-finance-ext.md §5 CIG-01, B-02
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');

function getFinanceSourceFiles(): string[] {
  const results: string[] = [];
  const packages = readdirSync(FINANCE_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'test-utils' && d.name !== 'node_modules');

  for (const pkg of packages) {
    const srcDir = join(FINANCE_ROOT, pkg.name, 'src');
    try {
      collectTsFiles(srcDir, results);
    } catch {
      // Package may not have src dir
    }
  }
  return results;
}

function collectTsFiles(dir: string, results: string[]): void {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip test directories
      if (entry.name === '__tests__' || entry.name === '__mocks__') continue;
      collectTsFiles(fullPath, results);
    } else if (
      entry.name.endsWith('.ts') &&
      !entry.name.endsWith('.test.ts') &&
      !entry.name.endsWith('.spec.ts')
    ) {
      results.push(fullPath);
    }
  }
}

const RAW_ERROR_PATTERNS = [
  /throw\s+new\s+Error\s*\(/,
  /Promise\.reject\s*\(\s*new\s+Error\s*\(/,
  /return\s+new\s+Error\s*\(/,
];

/** Pre-existing raw Error throws — ratchet: count can decrease, never increase */
const DOMAIN_ERROR_RATCHET = 23;

describe('gate.domain-error — CIG-01', () => {
  const files = getFinanceSourceFiles();

  it('finds finance source files to scan', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it(`raw Error throws do not exceed ratchet (max ${DOMAIN_ERROR_RATCHET})`, () => {
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip lines with ADR exception comment
        if (line.includes('// ADR:')) continue;

        for (const pattern of RAW_ERROR_PATTERNS) {
          if (pattern.test(line)) {
            const relPath = file.replace(FINANCE_ROOT, '').replace(/\\/g, '/');
            violations.push(`${relPath}:${i + 1} — ${line.trim()}`);
          }
        }
      }
    }

    expect(
      violations.length,
      `Raw Error throws found (ratchet: max ${DOMAIN_ERROR_RATCHET}, found ${violations.length}):\n${violations.join('\n')}`,
    ).toBeLessThanOrEqual(DOMAIN_ERROR_RATCHET);
  });
});
