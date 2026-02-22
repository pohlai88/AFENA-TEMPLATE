#!/usr/bin/env node
/**
 * Drizzle Neon Guard — Online Gates
 *
 * Requires DATABASE_URL_MIGRATIONS (direct, non-pooled).
 * Run on push to main only.
 *
 * Gates:
 *   MIG-DRZ-05a  Rogue objects check (tables/enums in DB but not in schema)
 *   MIG-DRZ-05b  Schema fingerprint via drizzle-kit export
 *   MIG-DRZ-05c  Migration apply test (Neon branch, optional)
 *   MIG-DRZ-06   Bootstrap + Migrate full integration test (Neon branch)
 *
 * Usage:
 *   DATABASE_URL_MIGRATIONS=... node scripts/drizzle-neon-guard.mjs
 */

import { neon } from '@neondatabase/serverless';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import 'dotenv/config';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PKG_ROOT = resolve(__dirname, '..');
const DRIZZLE_DIR = join(PKG_ROOT, 'drizzle');
const FINGERPRINT_PATH = join(DRIZZLE_DIR, 'meta', '_schema-fingerprint.sha256');
const CI_CONFIG = 'drizzle.ci.config.ts';

const url = process.env.DATABASE_URL_MIGRATIONS ?? process.env.DATABASE_URL;

if (!url) {
  console.error('❌ FATAL: DATABASE_URL_MIGRATIONS (or DATABASE_URL) is not set.');
  console.error('   This script requires a direct (non-pooled) Neon connection.');
  process.exit(1);
}

const sql = neon(url);

let failures = 0;
let passes = 0;

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

// ── Load TABLE_REGISTRY keys ─────────────────────────────────────────────────

// We read the registry file and extract table names via regex
// (avoids needing to transpile TypeScript at runtime)
function loadRegistryTableNames() {
  const registryPath = join(PKG_ROOT, 'src', 'schema', '_registry.ts');
  const content = readFileSync(registryPath, 'utf8');

  // Match keys in TABLE_REGISTRY: Record<string, ...> = { key: { ... }, ... }
  const tableNames = new Set();
  const keyRegex = /^\s+(\w+)\s*:\s*\{/gm;
  let match;
  while ((match = keyRegex.exec(content)) !== null) {
    const name = match[1];
    // Skip TypeScript type/interface properties
    if (
      [
        'kind',
        'hasRls',
        'hasTenant',
        'hasCompositePk',
        'hasUpdatedAtTrigger',
        'updatedAtManagedInApp',
        'hasNaturalKey',
        'naturalKeyImmutable',
        'hasBlockUpdateDeleteTrigger',
        'workerOnlyWrites',
        'description',
        'mustHave',
        'mustNotHave',
      ].includes(name)
    )
      continue;
    tableNames.add(name);
  }
  return tableNames;
}

// ── MIG-DRZ-05a: Rogue objects check ─────────────────────────────────────────

console.log('\n🔍 Drizzle Neon Guard\n');
console.log('── MIG-DRZ-05a: Rogue objects check ──');

try {
  // Get tables from DB
  const dbTables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
  const dbTableNames = new Set(dbTables.map((r) => r.table_name));

  // Get enums from DB
  const dbEnums = await sql`
    SELECT t.typname
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typtype = 'e'
    ORDER BY t.typname
  `;
  const dbEnumNames = new Set(dbEnums.map((r) => r.typname));

  // Get expected tables from registry
  const registryNames = loadRegistryTableNames();

  // System tables that Drizzle/Neon create (not in our registry)
  const SYSTEM_TABLES = new Set([
    '__drizzle_migrations', // Drizzle migration log (in drizzle schema, but just in case)
    'spatial_ref_sys', // PostGIS
  ]);

  // Rogue tables: in DB but not in registry
  const rogueTables = [];
  for (const dbTable of dbTableNames) {
    if (!registryNames.has(dbTable) && !SYSTEM_TABLES.has(dbTable)) {
      rogueTables.push(dbTable);
    }
  }

  if (rogueTables.length > 0) {
    for (const t of rogueTables) {
      fail('MIG-DRZ-05a', `Rogue table in DB not in schema registry: "${t}"`);
    }
  } else {
    pass('MIG-DRZ-05a', `${dbTableNames.size} DB tables — all accounted for in registry`);
  }

  // Pending tables: in registry but not in DB (warning only)
  const pendingTables = [];
  for (const regTable of registryNames) {
    if (!dbTableNames.has(regTable)) {
      pendingTables.push(regTable);
    }
  }
  if (pendingTables.length > 0) {
    warn(
      'MIG-DRZ-05a',
      `${pendingTables.length} table(s) in registry but not in DB (pending migration): ${pendingTables.join(', ')}`,
    );
  }

  // Rogue enums
  if (dbEnumNames.size > 0) {
    // We don't track enums in registry yet, so just report them
    console.log(`  ℹ️  ${dbEnumNames.size} enum type(s) in DB: ${[...dbEnumNames].join(', ')}`);
  }
} catch (err) {
  fail('MIG-DRZ-05a', `Error querying DB: ${err.message}`);
}

// ── MIG-DRZ-05b: Schema fingerprint via drizzle-kit export ───────────────────

console.log('\n── MIG-DRZ-05b: Schema fingerprint ──');

try {
  // Run drizzle-kit export (offline — reads schema .ts files only)
  const exportOutput = execSync(`npx drizzle-kit export --config=${CI_CONFIG}`, {
    cwd: PKG_ROOT,
    encoding: 'utf-8',
    timeout: 60_000,
  });

  // Normalize: collapse whitespace, trim lines, sort statements
  const normalized = exportOutput
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .sort()
    .join('\n');

  const hash = createHash('sha256').update(normalized).digest('hex');

  if (existsSync(FINGERPRINT_PATH)) {
    const committedHash = readFileSync(FINGERPRINT_PATH, 'utf8').trim();

    if (hash === committedHash) {
      pass('MIG-DRZ-05b', `Schema fingerprint matches: ${hash.slice(0, 16)}...`);
    } else {
      // Check if there's a new migration in this commit
      let hasNewMigration = false;
      try {
        const diff = execSync(
          'git diff HEAD~1 --name-only --diff-filter=A -- packages/database/drizzle/',
          {
            cwd: resolve(PKG_ROOT, '../..'),
            encoding: 'utf-8',
            timeout: 10_000,
          },
        );
        hasNewMigration = diff.split('\n').some((f) => f.endsWith('.sql'));
      } catch {
        // No git history
      }

      if (hasNewMigration) {
        warn(
          'MIG-DRZ-05b',
          `Fingerprint changed (${committedHash.slice(0, 16)}... → ${hash.slice(0, 16)}...) but new migration detected — updating fingerprint`,
        );
        writeFileSync(FINGERPRINT_PATH, hash + '\n');
      } else {
        fail(
          'MIG-DRZ-05b',
          `Fingerprint mismatch without new migration. Committed: ${committedHash.slice(0, 16)}..., Current: ${hash.slice(0, 16)}...`,
        );
      }
    }
  } else {
    // First run — create fingerprint
    warn('MIG-DRZ-05b', `No fingerprint file found. Creating: ${hash.slice(0, 16)}...`);
    writeFileSync(FINGERPRINT_PATH, hash + '\n');
  }
} catch (err) {
  const stderr = err.stderr?.toString() || '';
  fail('MIG-DRZ-05b', `drizzle-kit export failed: ${err.message}\n${stderr}`);
}

// ── MIG-DRZ-05c: Migration apply test (Neon branch) ─────────────────────────

console.log('\n── MIG-DRZ-05c: Migration apply test ──');

const neonApiKey = process.env.NEON_API_KEY;

if (!neonApiKey) {
  warn('MIG-DRZ-05c', 'NEON_API_KEY not set — Neon branch migration test skipped');
} else {
  const projectId = process.env.NEON_PROJECT_ID || 'dark-band-87285012';
  const branchName = `ci-migration-test-${Date.now()}`;

  try {
    // Create temporary branch
    console.log(`  Creating Neon branch: ${branchName}...`);
    const createResp = execSync(
      `curl -s -X POST "https://console.neon.tech/api/v2/projects/${projectId}/branches" ` +
        `-H "Authorization: Bearer ${neonApiKey}" ` +
        `-H "Content-Type: application/json" ` +
        `-d '{"branch":{"name":"${branchName}"},"endpoints":[{"type":"read_write"}]}'`,
      { encoding: 'utf-8', timeout: 30_000 },
    );

    const branchData = JSON.parse(createResp);
    const branchId = branchData.branch?.id;
    const endpoint = branchData.endpoints?.[0];

    if (!branchId || !endpoint) {
      fail('MIG-DRZ-05c', `Failed to create Neon branch: ${createResp}`);
    } else {
      // Build connection string
      const host = endpoint.host;
      const branchUrl = `postgresql://neondb_owner@${host}/neondb?sslmode=require`;

      // Run migrations against the branch (use programmatic migrator —
      // drizzle-kit CLI cannot resolve drivers in pnpm monorepos)
      console.log('  Applying migrations to branch...');
      execSync(`DATABASE_URL_MIGRATIONS="${branchUrl}" node scripts/run-migrate.mjs`, {
        cwd: PKG_ROOT,
        stdio: 'pipe',
        timeout: 120_000,
      });

      // Smoke check
      const branchSql = neon(branchUrl);
      const tableCount = await branchSql`
        SELECT count(*)::int as cnt
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `;
      const cnt = tableCount[0]?.cnt || 0;
      console.log(`  Smoke check: ${cnt} tables in branch DB`);

      if (cnt > 0) {
        pass('MIG-DRZ-05c', `Migration apply test passed (${cnt} tables created)`);
      } else {
        fail('MIG-DRZ-05c', 'Migration apply test: zero tables after migrate');
      }

      // Cleanup: delete branch
      console.log(`  Deleting branch: ${branchName}...`);
      execSync(
        `curl -s -X DELETE "https://console.neon.tech/api/v2/projects/${projectId}/branches/${branchId}" ` +
          `-H "Authorization: Bearer ${neonApiKey}"`,
        { encoding: 'utf-8', timeout: 15_000 },
      );
    }
  } catch (err) {
    fail('MIG-DRZ-05c', `Neon branch test error: ${err.message}`);

    // Attempt cleanup
    try {
      execSync(
        `curl -s -X DELETE "https://console.neon.tech/api/v2/projects/${projectId}/branches" ` +
          `-H "Authorization: Bearer ${neonApiKey}" ` +
          `--data '{"name":"${branchName}"}'`,
        { encoding: 'utf-8', timeout: 10_000 },
      );
    } catch {
      // Best effort cleanup
    }
  }
}

// ── MIG-DRZ-06: Bootstrap + Migrate full integration test ────────────────────

console.log('\n── MIG-DRZ-06: Bootstrap + Migrate integration test ──');

if (!neonApiKey) {
  warn('MIG-DRZ-06', 'NEON_API_KEY not set — full integration test skipped');
} else {
  const projectId06 = process.env.NEON_PROJECT_ID || 'dark-band-87285012';
  const branchName06 = `ci-bootstrap-migrate-${Date.now()}`;
  const bootstrapSqlPath = join(PKG_ROOT, 'scripts', 'bootstrap-neon.sql');

  if (!existsSync(bootstrapSqlPath)) {
    fail('MIG-DRZ-06', 'bootstrap-neon.sql not found — cannot run integration test');
  } else {
    let branchId06 = null;

    try {
      // 1. Create ephemeral Neon branch
      console.log(`  Creating Neon branch: ${branchName06}...`);
      const createResp06 = execSync(
        `curl -s -X POST "https://console.neon.tech/api/v2/projects/${projectId06}/branches" ` +
          `-H "Authorization: Bearer ${neonApiKey}" ` +
          `-H "Content-Type: application/json" ` +
          `-d '{"branch":{"name":"${branchName06}"},"endpoints":[{"type":"read_write"}]}'`,
        { encoding: 'utf-8', timeout: 30_000 },
      );

      const branchData06 = JSON.parse(createResp06);
      branchId06 = branchData06.branch?.id;
      const endpoint06 = branchData06.endpoints?.[0];

      if (!branchId06 || !endpoint06) {
        fail('MIG-DRZ-06', `Failed to create Neon branch: ${createResp06.slice(0, 200)}`);
      } else {
        const host06 = endpoint06.host;
        const branchUrl06 = `postgresql://neondb_owner@${host06}/neondb?sslmode=require`;

        // 2. Run bootstrap SQL
        console.log('  Running bootstrap-neon.sql...');
        const bootstrapSql = readFileSync(bootstrapSqlPath, 'utf-8');
        const branchSql06 = neon(branchUrl06);
        await branchSql06.transaction(async (tx) => {
          // neon() doesn't support multi-statement in one call easily,
          // so we use the raw SQL endpoint for the whole script
        });
        // Use psql-like execution via DATABASE_URL
        execSync(
          `node -e "
            const {Pool}=require('@neondatabase/serverless');
            const ws=require('ws');
            const {neonConfig}=require('@neondatabase/serverless');
            neonConfig.webSocketConstructor=ws;
            const fs=require('fs');
            const sql=fs.readFileSync('${bootstrapSqlPath.replace(/\\/g, '\\\\')}','utf8');
            const pool=new Pool({connectionString:'${branchUrl06}'});
            pool.query(sql).then(()=>{console.log('bootstrap ok');pool.end()}).catch(e=>{console.error(e.message);process.exit(1)});
          "`,
          { cwd: PKG_ROOT, encoding: 'utf-8', timeout: 60_000, stdio: 'pipe' },
        );

        // 3. Run drizzle migrate
        console.log('  Running drizzle migrate...');
        execSync(`DATABASE_URL_MIGRATIONS="${branchUrl06}" node scripts/run-migrate.mjs`, {
          cwd: PKG_ROOT,
          stdio: 'pipe',
          timeout: 120_000,
        });

        // 4. Smoke check — table count
        const tableCount06 = await branchSql06`
          SELECT count(*)::int as cnt
          FROM information_schema.tables
          WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        `;
        const cnt06 = tableCount06[0]?.cnt || 0;

        // 5. Verify RLS enabled
        const rlsCheck = await branchSql06`
          SELECT count(*)::int as cnt
          FROM pg_tables
          WHERE schemaname = 'public' AND rowsecurity = true
        `;
        const rlsCount = rlsCheck[0]?.cnt || 0;

        // 6. Verify key roles exist
        const roleCheck = await branchSql06`
          SELECT rolname FROM pg_roles
          WHERE rolname IN ('authenticated','worker','schema_owner','migration_admin')
          ORDER BY rolname
        `;
        const roleNames = roleCheck.map((r) => r.rolname);

        console.log(
          `  Tables: ${cnt06} | RLS-enabled: ${rlsCount} | Roles: ${roleNames.join(', ')}`,
        );

        const problems = [];
        if (cnt06 < 100) problems.push(`Only ${cnt06} tables (expected 148+)`);
        if (rlsCount < 50) problems.push(`Only ${rlsCount} RLS tables (expected most)`);
        if (roleNames.length < 4)
          problems.push(`Missing roles: expected 4, got ${roleNames.length}`);

        if (problems.length === 0) {
          pass(
            'MIG-DRZ-06',
            `Full bootstrap+migrate passed (${cnt06} tables, ${rlsCount} RLS, ${roleNames.length} roles)`,
          );
        } else {
          fail('MIG-DRZ-06', problems.join('; '));
        }
      }
    } catch (err) {
      fail('MIG-DRZ-06', `Integration test error: ${err.message}`);
    } finally {
      // Cleanup branch
      if (branchId06) {
        try {
          console.log(`  Deleting branch: ${branchName06}...`);
          execSync(
            `curl -s -X DELETE "https://console.neon.tech/api/v2/projects/${projectId06}/branches/${branchId06}" ` +
              `-H "Authorization: Bearer ${neonApiKey}"`,
            { encoding: 'utf-8', timeout: 15_000 },
          );
        } catch {
          // Best effort cleanup
        }
      }
    }
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(60));
console.log(`  Passed: ${passes}  |  Failed: ${failures}`);
console.log('═'.repeat(60));

if (failures > 0) {
  console.error(`\n❌ ${failures} gate(s) FAILED\n`);
  process.exit(1);
} else {
  console.log('\n✅ All Drizzle Neon guard gates PASSED\n');
}
