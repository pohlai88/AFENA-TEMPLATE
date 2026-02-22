import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * FIN-05 — No Direct Journal Crafting
 *
 * Domain packages under business-domain/finance/ MUST NOT directly import
 * journal_entries / journal_lines tables from the database schema for INSERT.
 * Only `accounting-hub` is authorized to post journal entries to the GL.
 *
 * All other packages emit DomainIntents which flow through the
 * accounting-hub derivation engine, ensuring:
 *   - Consistent mapping rule application
 *   - Deterministic derivation IDs
 *   - Balanced DR = CR enforcement
 *   - Audit-trail completeness
 *
 * Scope: All business-domain/finance/* packages EXCEPT accounting-hub
 *        and accounting (the reference implementation).
 *
 * Exemptions:
 *   - `accounting-hub` — IS the journal posting engine
 *   - `accounting` — reference implementation (existing, pre-hub)
 *   - Query-only reads of journal_lines for trial balance, etc. are OK
 */

const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');
const EXEMPT_PACKAGES = ['accounting-hub', 'accounting'];

/**
 * Patterns that indicate direct journal table mutation (INSERT/UPDATE).
 * Read-only select patterns are allowed.
 */
const JOURNAL_MUTATION_PATTERNS = [
  // Direct import of journal table for insert
  /\.insert\s*\(\s*journal(?:Entries|Lines|_entries|_lines)\s*\)/,
  // Drizzle insert into journal tables
  /db\s*\.\s*insert\s*\(\s*journal/,
  // tx.insert(journalLines)
  /tx\s*\.\s*insert\s*\(\s*journal/,
  // Raw SQL insert into journal tables
  /INSERT\s+INTO\s+.*journal/i,
];

describe('FIN-05: no direct journal crafting outside accounting-hub', () => {
  /** Recursively collect .ts source files (exclude tests). */
  function collectTsFiles(dir: string): string[] {
    if (!existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry !== 'node_modules' && entry !== 'dist' && entry !== '__tests__') {
          results.push(...collectTsFiles(full));
        }
      } else if (
        entry.endsWith('.ts') &&
        !entry.endsWith('.test.ts') &&
        !entry.endsWith('.spec.ts')
      ) {
        results.push(full);
      }
    }
    return results;
  }

  test('business-domain/finance/ exists', () => {
    expect(existsSync(FINANCE_ROOT)).toBe(true);
  });

  test('no finance package (except accounting-hub) directly inserts into journal tables', () => {
    const packages = readdirSync(FINANCE_ROOT).filter((entry) => {
      const full = join(FINANCE_ROOT, entry);
      return (
        statSync(full).isDirectory() &&
        existsSync(join(full, 'package.json')) &&
        !EXEMPT_PACKAGES.includes(entry)
      );
    });

    const violations: Array<{ pkg: string; file: string; line: number; text: string }> = [];

    for (const pkg of packages) {
      const srcDir = join(FINANCE_ROOT, pkg, 'src');
      const files = collectTsFiles(srcDir);

      for (const filePath of files) {
        const content = readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]!;
          // Skip comments
          if (line.trimStart().startsWith('//') || line.trimStart().startsWith('*')) {
            continue;
          }

          for (const pattern of JOURNAL_MUTATION_PATTERNS) {
            if (pattern.test(line)) {
              violations.push({
                pkg,
                file: filePath.replace(FINANCE_ROOT, ''),
                line: i + 1,
                text: line.trim(),
              });
            }
          }
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `FIN-05: ${violations.length} direct journal mutation(s) found outside accounting-hub:\n` +
          violations.map((v) => `  ${v.pkg}${v.file}:${v.line}\n    → ${v.text}`).join('\n') +
          `\n\nDomain packages must emit DomainIntents → accounting-hub → GL.`,
      );
    }

    expect(violations).toEqual([]);
  });
});
