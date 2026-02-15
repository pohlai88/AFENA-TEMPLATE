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
/* eslint-disable security/detect-non-literal-fs-filename -- paths are ROOT + known constants from test config */
/* eslint-disable security/detect-unsafe-regex -- allowlist regex; input is single line from execSync */

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
  { file: 'packages/database/src/schema/_registry.ts', mustContain: `${ENTITY}: 'truth',` },
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

const EXEC_OPTS = {
  cwd: path.join(ROOT, 'packages', 'database'),
  stdio: 'pipe' as const,
  timeout: 30_000,
  maxBuffer: 10 * 1024 * 1024,
};

describe('B1 — Entity Generator Acceptance', () => {
  beforeAll(() => {
    // Snapshot all files that will be modified
    for (const m of MARKER_FILES) {
      snapshotFile(m.file);
    }

    try {
      execSync(`npx tsx src/scripts/entity-new.ts ${ENTITY}`, EXEC_OPTS);
    } catch (e) {
      const err = e as { stdout?: Buffer; stderr?: Buffer };
      process.stderr.write((err?.stdout?.toString?.() ?? '') + (err?.stderr?.toString?.() ?? ''));
      throw e;
    }
  }, 30_000);

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
  }, 30_000);

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

  it('idempotent: re-running generator skips everything (except allowed maintenance)', () => {
    const output = execSync(
      `npx tsx src/scripts/entity-new.ts ${ENTITY}`,
      EXEC_OPTS,
    ).toString();

    const lines = output
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const allowed = [
      // Schema barrel regen: "✅ Generated .../packages/database/src/schema/index.ts (N schema files)"
      /^✅ Generated .*packages[/\\]database[/\\]src[/\\]schema[/\\]index\.ts( \([0-9]+ schema files\))?$/,
      // Gate 7: db:barrel output (schema barrel + manifest + table registry)
      /^> afena-database@.* db:barrel/,
      /^> npx tsx src\/scripts\/generate-/,
      /^✅ Schema barrel unchanged$/,
      /^✅ Schema manifest unchanged$/,
      /^✅ Table registry unchanged$/,
      /^✅ Generated .*__schema-manifest\.ts/,
      /^✅ Generated .*_registry\.ts/,
    ];

    const rejected = [
      /Inserted .*_registry/i,
      // Gate 7: _registry is generated; "Generated _registry" on re-run would mean drift
      // (allowed on first run when new table added; rejected means test expects idempotent)
    ];

    const isBox = (l: string) => /[╔║╠╚]/.test(l);
    const isSkip = (l: string) => l.includes('SKIP');
    const isAllowed = (l: string) => allowed.some((re) => re.test(l));
    const isRejected = (l: string) => rejected.some((re) => re.test(l));

    const unexpected = lines.filter((l) => !isSkip(l) && !isBox(l) && !isAllowed(l));
    expect(
      unexpected,
      `Unexpected output on re-run:\n${unexpected.join('\n')}\n\nFull output:\n${output}`,
    ).toEqual([]);

    const rejectedLines = lines.filter(isRejected);
    expect(
      rejectedLines,
      `Registry insert must not appear on re-run (Gate 7: registry is generated):\n${rejectedLines.join('\n')}`,
    ).toEqual([]);

    const nonSkipNonBox = lines.filter((l) => !isSkip(l) && !isBox(l));
    expect(
      nonSkipNonBox.every(isAllowed),
      `Non-skip lines must all be in allowlist:\n${nonSkipNonBox.join('\n')}`,
    ).toBe(true);
  }, 30_000);
});
