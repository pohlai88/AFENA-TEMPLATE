/**
 * B1 — Generator Acceptance Test (Gate G2 enforcement)
 *
 * Generates a temp entity "widgets", verifies:
 *   1. All expected files are created
 *   2. All registry markers contain the new entity
 *   3. HANDLER_META includes the new entity
 *   4. ACTION_TYPES includes all expected action types
 *   5. ENTITY_TYPES includes the new entity
 *   6. Cleanup restores all files to original state
 *
 * This test does NOT require a database connection.
 * It runs the generator script via child_process and inspects files.
 */

import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const ENTITY = 'widgets';
const SINGULAR = 'widget';
const PASCAL_SINGULAR = 'Widget';
const PASCAL_PLURAL = 'Widgets';

// Files that the generator should create
const EXPECTED_CREATED_FILES = [
  `packages/database/src/schema/${ENTITY}.ts`,
  `packages/crud/src/handlers/${ENTITY}.ts`,
  `packages/crud/src/__tests__/${ENTITY}.smoke.test.ts`,
  `packages/search/src/adapters/${ENTITY}.ts`,
  `apps/web/app/actions/${ENTITY}.ts`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/page.tsx`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/[id]/page.tsx`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/new/page.tsx`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/[id]/edit/page.tsx`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/[id]/versions/page.tsx`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/[id]/audit/page.tsx`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/trash/page.tsx`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/surface.ts`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/_components/${SINGULAR}-contract.ts`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/_components/${SINGULAR}-columns.ts`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/_components/${SINGULAR}-fields.ts`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/_server/${ENTITY}.query_server.ts`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/_server/${ENTITY}.policy_server.ts`,
  `apps/web/app/(app)/org/[slug]/${ENTITY}/_server/${ENTITY}.server-actions.ts`,
];

// Files that the generator modifies via markers
const MARKER_FILES: Array<{ file: string; mustContain: string }> = [
  { file: 'packages/canon/src/types/entity.ts', mustContain: `'${ENTITY}'` },
  { file: 'packages/canon/src/types/action.ts', mustContain: `'${ENTITY}.create'` },
  { file: 'packages/canon/src/types/capability.ts', mustContain: `'${ENTITY}.create'` },
  { file: 'packages/crud/src/mutate.ts', mustContain: `${ENTITY}: ${ENTITY}Handler` },
  { file: 'packages/crud/src/read.ts', mustContain: `${ENTITY},` },
  { file: 'packages/crud/src/handler-meta.ts', mustContain: `${ENTITY}: [` },
  { file: `apps/web/app/(app)/org/[slug]/_components/nav-config.ts`, mustContain: `'${PASCAL_PLURAL}'` },
  { file: 'packages/database/src/schema/index.ts', mustContain: `from './${ENTITY}'` },
];

// Snapshot originals for cleanup
const originals = new Map<string, string>();

function snapshotFile(relPath: string): void {
  const abs = path.join(ROOT, relPath);
  if (fs.existsSync(abs)) {
    originals.set(relPath, fs.readFileSync(abs, 'utf-8'));
  }
}

function restoreFile(relPath: string): void {
  const abs = path.join(ROOT, relPath);
  const original = originals.get(relPath);
  if (original !== undefined) {
    fs.writeFileSync(abs, original, 'utf-8');
  }
}

function deleteIfExists(relPath: string): void {
  const abs = path.join(ROOT, relPath);
  if (fs.existsSync(abs)) {
    fs.rmSync(abs, { recursive: true, force: true });
  }
}

describe('B1 — Entity Generator Acceptance', () => {
  beforeAll(() => {
    // Snapshot all files that will be modified
    for (const m of MARKER_FILES) {
      snapshotFile(m.file);
    }
    // Also snapshot mutate.ts import line (generator adds import)
    // Already covered by MARKER_FILES

    // Run the generator
    execSync(
      `npx tsx src/scripts/entity-new.ts ${ENTITY}`,
      {
        cwd: path.join(ROOT, 'packages', 'database'),
        stdio: 'pipe',
        timeout: 30_000,
      },
    );
  });

  afterAll(() => {
    // Restore all modified files
    for (const m of MARKER_FILES) {
      restoreFile(m.file);
    }

    // Delete all created files
    for (const f of EXPECTED_CREATED_FILES) {
      deleteIfExists(f);
    }

    // Delete the entire widgets UI directory tree
    deleteIfExists(`apps/web/app/(app)/org/[slug]/${ENTITY}`);
  });

  it('creates all expected files', () => {
    const missing: string[] = [];
    for (const f of EXPECTED_CREATED_FILES) {
      if (!fs.existsSync(path.join(ROOT, f))) {
        missing.push(f);
      }
    }
    expect(missing, `Missing files: ${missing.join(', ')}`).toEqual([]);
  });

  it('wires all registry markers', () => {
    const failures: string[] = [];
    for (const m of MARKER_FILES) {
      const content = fs.readFileSync(path.join(ROOT, m.file), 'utf-8');
      if (!content.includes(m.mustContain)) {
        failures.push(`${m.file} missing: ${m.mustContain}`);
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('ENTITY_TYPES includes widgets', () => {
    const content = fs.readFileSync(
      path.join(ROOT, 'packages/canon/src/types/entity.ts'),
      'utf-8',
    );
    expect(content).toContain(`'${ENTITY}'`);
  });

  it('ACTION_TYPES includes all 4 base verbs', () => {
    const content = fs.readFileSync(
      path.join(ROOT, 'packages/canon/src/types/action.ts'),
      'utf-8',
    );
    for (const verb of ['create', 'update', 'delete', 'restore']) {
      expect(content, `Missing ${ENTITY}.${verb}`).toContain(`'${ENTITY}.${verb}'`);
    }
  });

  it('HANDLER_META includes widgets with 4 verbs', () => {
    const content = fs.readFileSync(
      path.join(ROOT, 'packages/crud/src/handler-meta.ts'),
      'utf-8',
    );
    expect(content).toContain(`${ENTITY}: ['create', 'update', 'delete', 'restore']`);
  });

  it('HANDLER_REGISTRY includes widgets handler', () => {
    const content = fs.readFileSync(
      path.join(ROOT, 'packages/crud/src/mutate.ts'),
      'utf-8',
    );
    expect(content).toContain(`${ENTITY}: ${ENTITY}Handler`);
  });

  it('TABLE_REGISTRY (mutate) includes widgets', () => {
    const content = fs.readFileSync(
      path.join(ROOT, 'packages/crud/src/mutate.ts'),
      'utf-8',
    );
    // Should appear in TABLE_REGISTRY section
    const tableSection = content.slice(content.indexOf('TABLE_REGISTRY'));
    expect(tableSection).toContain(`${ENTITY},`);
  });

  it('TABLE_REGISTRY (read) includes widgets', () => {
    const content = fs.readFileSync(
      path.join(ROOT, 'packages/crud/src/read.ts'),
      'utf-8',
    );
    const tableSection = content.slice(content.indexOf('TABLE_REGISTRY'));
    expect(tableSection).toContain(`${ENTITY},`);
  });

  it('CAPABILITY_CATALOG includes 8 widget capabilities', () => {
    const content = fs.readFileSync(
      path.join(ROOT, 'packages/canon/src/types/capability.ts'),
      'utf-8',
    );
    for (const cap of ['create', 'update', 'delete', 'restore', 'read', 'list', 'versions', 'audit']) {
      expect(content, `Missing ${ENTITY}.${cap}`).toContain(`'${ENTITY}.${cap}'`);
    }
  });

  it('nav-config includes Widgets entry', () => {
    const content = fs.readFileSync(
      path.join(ROOT, 'apps/web/app/(app)/org/[slug]/_components/nav-config.ts'),
      'utf-8',
    );
    expect(content).toContain(`'${PASCAL_PLURAL}'`);
    expect(content).toContain(`/${ENTITY}`);
  });

  it('generated schema file has correct table name', () => {
    const content = fs.readFileSync(
      path.join(ROOT, `packages/database/src/schema/${ENTITY}.ts`),
      'utf-8',
    );
    expect(content).toContain(`export const ${ENTITY} = pgTable`);
    expect(content).toContain(`'${ENTITY}'`);
    expect(content).toContain(`export type ${PASCAL_SINGULAR}`);
  });

  it('generated handler file has correct handler name', () => {
    const content = fs.readFileSync(
      path.join(ROOT, `packages/crud/src/handlers/${ENTITY}.ts`),
      'utf-8',
    );
    expect(content).toContain(`export const ${ENTITY}Handler: EntityHandler`);
  });

  it('generated smoke test references correct entity', () => {
    const content = fs.readFileSync(
      path.join(ROOT, `packages/crud/src/__tests__/${ENTITY}.smoke.test.ts`),
      'utf-8',
    );
    expect(content).toContain(`'${ENTITY}'`);
    expect(content).toContain(`'${ENTITY}.create'`);
  });

  it('surface files have correct surfaceId format', () => {
    const content = fs.readFileSync(
      path.join(ROOT, `apps/web/app/(app)/org/[slug]/${ENTITY}/surface.ts`),
      'utf-8',
    );
    expect(content).toContain(`web.${ENTITY}.list.page`);
  });

  it('idempotent: re-running generator skips everything', () => {
    const output = execSync(
      `npx tsx src/scripts/entity-new.ts ${ENTITY}`,
      {
        cwd: path.join(ROOT, 'packages', 'database'),
        stdio: 'pipe',
        timeout: 30_000,
      },
    ).toString();

    // Every line should be a SKIP
    const lines = output.split('\n').filter((l) => l.trim().length > 0);
    const nonSkipLines = lines.filter(
      (l) => !l.includes('SKIP') && !l.includes('╔') && !l.includes('║') && !l.includes('╠') && !l.includes('╚'),
    );
    expect(
      nonSkipLines,
      `Non-skip lines on re-run: ${nonSkipLines.join('\n')}`,
    ).toEqual([]);
  });
});
