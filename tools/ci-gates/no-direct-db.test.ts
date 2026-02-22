import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * G-CRUD-03 — No Direct `db` Imports Anywhere in src/ (Static Analysis)
 *
 * Enforces Phase 6 architecture: ALL files in packages/crud/src/ MUST use
 * `withMutationTransaction()` / `withReadSession()` / `createDbSession()`
 * instead of importing the bare `db` or `dbRo` singletons directly.
 *
 * Phase 5 scoped this to commit/ + mutate.ts.
 * Phase 6 expands the gate to the entire src/ tree now that plan/ reads
 * and deliver/ fire-and-forget have been migrated.
 *
 * Rationale:
 *   - `db` bypasses DbSession auth context (breaks RLS row isolation)
 *   - `db` bypasses `withDbRetry()` (no transient error recovery)
 *   - `db.transaction()` doesn't set `SET LOCAL` (governor / RLS gap)
 *
 * Scope: ALL packages/crud/src/**\/*.ts
 *
 * Checked patterns (from 'afenda-database' imports):
 *   - `db` singleton
 *   - `dbRo` singleton
 *
 * Exception:
 *   - commit/session.ts is explicitly excluded: it IS the session factory
 *     and allowed to import `createDbSession` (but NOT bare `db`).
 */

const CRUD_SRC = resolve(__dirname, '../../packages/crud/src');
const COMMIT_DIR = join(CRUD_SRC, 'commit');
const SESSION_FILE = join(COMMIT_DIR, 'session.ts');

/**
 * Pattern matching `db` or `dbRo` in an import statement from 'afenda-database'.
 * Covers: `import { db }`, `import { db, x }`, `import { x, db }`, etc.
 * But NOT: `import { createDbSession }`, `import { withDbRetry }`, etc.
 */
const BARE_DB_IMPORT_RE = /import\s*\{[^}]*\b(db|dbRo)\b[^}]*\}\s*from\s*['"]afenda-database['"]/;

describe('G-CRUD-03: no bare db/dbRo imports anywhere in src/', () => {
  /** Recursively collect all .ts files excluding tests, specs, and node_modules. */
  function collectTsFiles(dir: string): string[] {
    if (!existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry !== 'node_modules' && entry !== 'dist') {
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

  test('packages/crud/src/ directory exists', () => {
    expect(existsSync(CRUD_SRC)).toBe(true);
  });

  test('commit/session.ts exists (session factory must be present)', () => {
    expect(existsSync(SESSION_FILE)).toBe(true);
  });

  test('all src/ files (except session.ts) have no bare db/dbRo imports', () => {
    const files = collectTsFiles(CRUD_SRC).filter(
      (f) => f !== SESSION_FILE, // session.ts is the factory — explicitly excluded
    );

    const violations: Array<{ file: string; match: string }> = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        if (BARE_DB_IMPORT_RE.test(line)) {
          violations.push({ file, match: line.trim() });
        }
      }
    }

    if (violations.length > 0) {
      const report = violations
        .map((v) => `  ${v.file.replace(CRUD_SRC, 'src')}\n    → ${v.match}`)
        .join('\n');
      throw new Error(
        `G-CRUD-03: ${violations.length} bare db/dbRo import(s) found in src/.\n` +
        `Use withMutationTransaction(), withReadSession(), or createDbSession() instead.\n\n` +
        report,
      );
    }

    expect(violations).toHaveLength(0);
  });

  test('commit/session.ts imports createDbSession but NOT bare db singleton', () => {
    if (!existsSync(SESSION_FILE)) return; // skip if not yet created

    const content = readFileSync(SESSION_FILE, 'utf-8');

    // session.ts must NOT import raw `db` (removed in Phase 5)
    expect(BARE_DB_IMPORT_RE.test(content)).toBe(false);

    // session.ts MUST import createDbSession (its whole purpose)
    expect(content).toContain('createDbSession');
  });
});

