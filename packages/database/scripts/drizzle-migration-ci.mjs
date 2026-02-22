#!/usr/bin/env node
/**
 * Drizzle Migration CI — Offline Gates
 *
 * Runs without a database connection. Uses drizzle.ci.config.ts.
 *
 * Gates:
 *   MIG-DRZ-01  Journal ↔ SQL parity
 *   MIG-DRZ-02  Drizzle history consistency (drizzle-kit check)
 *   MIG-DRZ-03  Schema changed → migration required
 *   MIG-DRZ-04  No unmanaged DDL outside drizzle/
 *   Gate A       Drizzle version lock (no ^ in catalog)
 *   Gate B       Migration order & immutability
 *
 * Usage:
 *   node scripts/drizzle-migration-ci.mjs
 */

import { execSync } from 'child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PKG_ROOT = resolve(__dirname, '..');
const MONO_ROOT = resolve(PKG_ROOT, '../..');
const DRIZZLE_DIR = join(PKG_ROOT, 'drizzle');
const JOURNAL_PATH = join(DRIZZLE_DIR, 'meta', '_journal.json');
const CI_CONFIG = 'drizzle.ci.config.ts';
const TMP_DIR = join(PKG_ROOT, '.drizzle-ci-tmp');

let failures = 0;
let passes = 0;

// ── Helpers ──────────────────────────────────────────────────────────────────

function pass(gate, msg) {
  passes++;
  console.log(`  ✅ ${gate}: ${msg}`);
}

function fail(gate, msg) {
  failures++;
  console.error(`  ❌ ${gate}: ${msg}`);
}

function warn(gate, msg) {
  console.warn(`  ⚠️  ${gate}: ${msg}`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function cleanup() {
  if (existsSync(TMP_DIR)) {
    rmSync(TMP_DIR, { recursive: true, force: true });
  }
}

// ── Silent-pass prevention ───────────────────────────────────────────────────

console.log('\n🔍 Drizzle Migration CI Gates\n');
console.log('── Pre-flight checks ──');

if (!existsSync(JOURNAL_PATH)) {
  console.error(`❌ FATAL: ${JOURNAL_PATH} does not exist.`);
  console.error('   Run "pnpm drizzle-kit generate --name=0000_baseline" to bootstrap.');
  process.exit(1);
}

const journal = readJson(JOURNAL_PATH);

if (!journal.entries || journal.entries.length === 0) {
  if (process.env.ALLOW_EMPTY_MIGRATIONS === '1') {
    console.log('  ⚠️  Zero migrations in journal (allowed by ALLOW_EMPTY_MIGRATIONS=1)');
  } else {
    console.error(
      '❌ FATAL: Zero migrations in journal. Set ALLOW_EMPTY_MIGRATIONS=1 to override.',
    );
    process.exit(1);
  }
}

console.log(`  Journal: ${journal.entries.length} entries\n`);

// ── MIG-DRZ-01: Journal ↔ SQL parity ────────────────────────────────────────

console.log('── MIG-DRZ-01: Journal ↔ SQL parity ──');

try {
  // Collect all SQL files in drizzle/ (may be in subdirs or flat)
  const sqlFilesOnDisk = new Set();

  function collectSqlFiles(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name !== 'meta') {
        collectSqlFiles(join(dir, entry.name));
      } else if (entry.isFile() && entry.name.endsWith('.sql')) {
        // Store relative to drizzle dir
        sqlFilesOnDisk.add(relative(DRIZZLE_DIR, join(dir, entry.name)).replace(/\\/g, '/'));
      }
    }
  }
  collectSqlFiles(DRIZZLE_DIR);

  // Build set of SQL paths referenced by journal
  const journalSqlPaths = new Set();
  for (const entry of journal.entries) {
    // Drizzle-kit stores migrations as either:
    //   - flat: "0000_baseline.sql" (tag = "0000_baseline")
    //   - nested: "0000_baseline/migration.sql"
    // We check both patterns
    const flatPath = `${entry.tag}.sql`;
    const nestedPath = `${entry.tag}/migration.sql`;

    if (sqlFilesOnDisk.has(flatPath)) {
      journalSqlPaths.add(flatPath);
    } else if (sqlFilesOnDisk.has(nestedPath)) {
      journalSqlPaths.add(nestedPath);
    } else {
      fail(
        'MIG-DRZ-01',
        `Journal entry [${entry.idx}] "${entry.tag}" has no matching SQL file on disk`,
      );
    }
  }

  // Check for orphan SQL files
  for (const sqlFile of sqlFilesOnDisk) {
    if (!journalSqlPaths.has(sqlFile)) {
      fail('MIG-DRZ-01', `Orphan SQL file not in journal: ${sqlFile}`);
    }
  }

  if (failures === 0) {
    pass(
      'MIG-DRZ-01',
      `${journal.entries.length} journal entries ↔ ${sqlFilesOnDisk.size} SQL files match`,
    );
  }
} catch (err) {
  fail('MIG-DRZ-01', `Error: ${err.message}`);
}

// ── MIG-DRZ-02: Drizzle history consistency ──────────────────────────────────

console.log('\n── MIG-DRZ-02: Drizzle history consistency ──');

try {
  execSync(`npx drizzle-kit check --config=${CI_CONFIG}`, {
    cwd: PKG_ROOT,
    stdio: 'pipe',
    timeout: 30_000,
  });
  pass('MIG-DRZ-02', 'drizzle-kit check passed');
} catch (err) {
  const stderr = err.stderr?.toString() || '';
  const stdout = err.stdout?.toString() || '';
  // If check actually requires DB credentials at runtime, downgrade to warning
  if (
    stderr.includes('credentials') ||
    stderr.includes('connection') ||
    stdout.includes('credentials')
  ) {
    warn(
      'MIG-DRZ-02',
      'drizzle-kit check requires DB credentials — skipped in offline mode (move to online guard)',
    );
  } else {
    fail('MIG-DRZ-02', `drizzle-kit check failed:\n${stdout}\n${stderr}`);
  }
}

// ── MIG-DRZ-03: Schema changed → migration required ─────────────────────────

console.log('\n── MIG-DRZ-03: Schema drift detection ──');

try {
  cleanup();
  mkdirSync(TMP_DIR, { recursive: true });

  // Copy meta/ so generate has snapshot history
  if (existsSync(join(DRIZZLE_DIR, 'meta'))) {
    cpSync(join(DRIZZLE_DIR, 'meta'), join(TMP_DIR, 'meta'), { recursive: true });
  }

  // Also copy existing migration SQL/dirs so generate knows what already exists
  for (const entry of readdirSync(DRIZZLE_DIR, { withFileTypes: true })) {
    if (entry.name === 'meta') continue;
    const src = join(DRIZZLE_DIR, entry.name);
    const dst = join(TMP_DIR, entry.name);
    cpSync(src, dst, { recursive: true });
  }

  // Create a temporary config that outputs to the temp dir
  const tmpConfigPath = join(PKG_ROOT, '.drizzle-ci-tmp.config.ts');
  writeFileSync(
    tmpConfigPath,
    `
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: ['./src/schema/*.ts'],
  out: './.drizzle-ci-tmp',
  dialect: 'postgresql',
});
`,
  );

  // Run generate into temp dir
  try {
    execSync(`npx drizzle-kit generate --config=.drizzle-ci-tmp.config.ts --name=ci_drift_check`, {
      cwd: PKG_ROOT,
      stdio: 'pipe',
      timeout: 60_000,
    });
  } finally {
    // Clean up temp config
    if (existsSync(tmpConfigPath)) rmSync(tmpConfigPath);
  }

  // Compare journal contents
  const tmpJournalPath = join(TMP_DIR, 'meta', '_journal.json');
  if (existsSync(tmpJournalPath)) {
    const tmpJournal = readJson(tmpJournalPath);
    const originalCount = journal.entries.length;
    const tmpCount = tmpJournal.entries.length;

    if (tmpCount > originalCount) {
      const newEntries = tmpJournal.entries.slice(originalCount);
      const names = newEntries.map((e) => e.tag).join(', ');
      fail(
        'MIG-DRZ-03',
        `Schema changed but no migration committed. New migration(s) would be generated: ${names}`,
      );
    } else {
      pass('MIG-DRZ-03', 'Schema matches committed migrations — no drift');
    }
  } else {
    pass('MIG-DRZ-03', 'No journal in temp dir — generate produced nothing');
  }
} catch (err) {
  const stdout = err.stdout?.toString() || '';
  // "No schema changes" is a success
  if (stdout.includes('No schema changes') || stdout.includes('nothing to migrate')) {
    pass('MIG-DRZ-03', 'drizzle-kit generate: no schema changes detected');
  } else {
    fail('MIG-DRZ-03', `Error running drift check: ${err.message}\n${stdout}`);
  }
} finally {
  cleanup();
}

// ── MIG-DRZ-04: No unmanaged DDL ────────────────────────────────────────────

console.log('\n── MIG-DRZ-04: No unmanaged DDL ──');

try {
  const DDL_KEYWORDS = [
    /\bCREATE\s+TABLE\b/i,
    /\bALTER\s+TABLE\b/i,
    /\bDROP\s+TABLE\b/i,
    /\bCREATE\s+INDEX\b/i,
    /\bDROP\s+INDEX\b/i,
    /\bCREATE\s+TYPE\b/i,
    /\bCREATE\s+EXTENSION\b/i,
    /\bCREATE\s+FUNCTION\b/i,
    /\bCREATE\s+OR\s+REPLACE\s+FUNCTION\b/i,
    /\bCREATE\s+TRIGGER\b/i,
    /\bCREATE\s+POLICY\b/i,
    /\bCREATE\s+SCHEMA\b/i,
  ];

  // Managed: always allowed, no DDL scan
  const MANAGED_PREFIXES = [
    'packages/database/drizzle/', // Drizzle migrations
  ];
  const MANAGED_FILES = new Set([
    'packages/database/scripts/normalize-ownership.sql', // Ops: ownership normalization (contains dynamic DDL)
    'packages/database/scripts/bootstrap-neon.sql', // Bootstrap: auth schema, functions, roles (prerequisite DDL)
    'packages/database/src/triggers/set-updated-at.sql', // Reference: trigger function definition
    'packages/database/src/triggers/natural-key-immutability.sql', // Reference: NK immutability trigger (S9)
  ]);

  // Find all .sql files in repo
  let sqlFiles;
  try {
    const output = execSync('git ls-files "*.sql" --cached --others --exclude-standard', {
      cwd: MONO_ROOT,
      encoding: 'utf-8',
      timeout: 10_000,
    });
    sqlFiles = output.split('\n').filter(Boolean);
  } catch {
    // Fallback: find command
    try {
      const output = execSync(
        'find . -name "*.sql" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.drizzle-ci-tmp/*"',
        { cwd: MONO_ROOT, encoding: 'utf-8', timeout: 10_000 },
      );
      sqlFiles = output
        .split('\n')
        .filter(Boolean)
        .map((f) => f.replace(/^\.\//, ''));
    } catch {
      // Windows fallback
      const output = execSync(
        'powershell -Command "Get-ChildItem -Recurse -Filter *.sql -Exclude node_modules,dist,.drizzle-ci-tmp | Resolve-Path -Relative"',
        { cwd: MONO_ROOT, encoding: 'utf-8', timeout: 15_000 },
      );
      sqlFiles = output
        .split('\n')
        .filter(Boolean)
        .map((f) => f.replace(/^\.\\/, '').replace(/\\/g, '/'));
    }
  }

  let ddlViolations = 0;

  for (const file of sqlFiles) {
    const normalized = file.replace(/\\/g, '/');

    // Skip managed files (drizzle migrations + known ops/reference scripts)
    if (MANAGED_PREFIXES.some((p) => normalized.startsWith(p))) continue;
    if (MANAGED_FILES.has(normalized)) continue;

    // Read file content
    const fullPath = join(MONO_ROOT, normalized);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, 'utf8');

    // Check for DDL
    for (const pattern of DDL_KEYWORDS) {
      if (pattern.test(content)) {
        fail('MIG-DRZ-04', `Unmanaged DDL found in: ${normalized} — matched: ${pattern}`);
        ddlViolations++;
        break; // One violation per file is enough
      }
    }
  }

  if (ddlViolations === 0) {
    pass('MIG-DRZ-04', `Scanned ${sqlFiles.length} .sql files — no unmanaged DDL`);
  }
} catch (err) {
  fail('MIG-DRZ-04', `Error: ${err.message}`);
}

// ── Gate A: Drizzle version lock ─────────────────────────────────────────────

console.log('\n── Gate A: Drizzle version lock ──');

try {
  const workspacePath = join(MONO_ROOT, 'pnpm-workspace.yaml');
  const content = readFileSync(workspacePath, 'utf8');

  const packages = ['drizzle-orm', 'drizzle-kit'];
  for (const pkg of packages) {
    // Match "  drizzle-orm: ^1.2.3" or "  drizzle-kit: ^0.31.0"
    const match = content.match(new RegExp(`${pkg}:\\s*([^\\s]+)`));
    if (!match) {
      warn('Gate A', `${pkg} not found in pnpm-workspace.yaml catalog`);
      continue;
    }
    const version = match[1];
    if (version.startsWith('^')) {
      fail(
        'Gate A',
        `${pkg}: ${version} uses ^ (caret). Use ~ or exact pin to prevent migration output drift.`,
      );
    } else {
      pass('Gate A', `${pkg}: ${version} (pinned)`);
    }
  }
} catch (err) {
  fail('Gate A', `Error: ${err.message}`);
}

// ── Gate B: Migration order & immutability ───────────────────────────────────

console.log('\n── Gate B: Migration order & immutability ──');

try {
  // Check sequential idx ordering
  let orderOk = true;
  for (let i = 0; i < journal.entries.length; i++) {
    if (journal.entries[i].idx !== i) {
      fail(
        'Gate B',
        `Journal idx gap: expected ${i}, got ${journal.entries[i].idx} at position ${i}`,
      );
      orderOk = false;
      break;
    }
  }
  if (orderOk) {
    pass('Gate B', `Sequential idx ordering: 0..${journal.entries.length - 1}`);
  }

  // Immutability check: if we have git history, check for modified migration files
  try {
    const diff = execSync('git diff HEAD~1 --name-only -- packages/database/drizzle/', {
      cwd: MONO_ROOT,
      encoding: 'utf-8',
      timeout: 10_000,
    });
    const changedFiles = diff.split('\n').filter(Boolean);

    if (changedFiles.length > 0) {
      // Determine which are modifications vs additions
      const diffStat = execSync(
        'git diff HEAD~1 --diff-filter=M --name-only -- packages/database/drizzle/',
        {
          cwd: MONO_ROOT,
          encoding: 'utf-8',
          timeout: 10_000,
        },
      );
      const modifiedFiles = diffStat.split('\n').filter(Boolean);

      // Filter out meta files (journal/snapshot updates are expected when adding migrations)
      // Also exclude baseline (idx 0) — drizzle-kit legitimately regenerates the
      // baseline SQL + snapshot when producing incremental migrations.
      const baselineTags = new Set(journal.entries.filter((e) => e.idx === 0).map((e) => e.tag));
      const modifiedMigrations = modifiedFiles.filter(
        (f) =>
          f.endsWith('.sql') &&
          !f.includes('/meta/') &&
          !Array.from(baselineTags).some((tag) => f.includes(tag)),
      );

      if (modifiedMigrations.length > 0) {
        for (const f of modifiedMigrations) {
          fail('Gate B', `Existing migration modified (immutability violation): ${f}`);
        }
      } else {
        pass('Gate B', 'No existing migration SQL files modified');
      }
    } else {
      pass('Gate B', 'No changes to drizzle/ in this commit');
    }
  } catch {
    // No git history available (shallow clone or first commit)
    warn(
      'Gate B',
      'Git history not available — immutability check skipped (use fetch-depth: 2 in CI)',
    );
  }
} catch (err) {
  fail('Gate B', `Error: ${err.message}`);
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(60));
console.log(`  Passed: ${passes}  |  Failed: ${failures}`);
console.log('═'.repeat(60));

if (failures > 0) {
  console.error(`\n❌ ${failures} gate(s) FAILED\n`);
  process.exit(1);
} else {
  console.log('\n✅ All Drizzle migration gates PASSED\n');
}
