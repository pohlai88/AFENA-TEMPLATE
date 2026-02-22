#!/usr/bin/env node
/**
 * Deterministic Migration Trigger Patcher
 *
 * After `pnpm db:generate`, run this to idempotently append NK immutability
 * trigger SQL to the newest migration file.
 *
 * Properties:
 *   - Idempotent: running twice produces zero diff (RG-07)
 *   - Fails if any required trigger SQL is missing after patching
 *   - Deterministic: output is sorted by table name
 *
 * Usage:
 *   pnpm --filter afenda-database db:patch-migration-triggers
 *
 * @see S9 — Natural Key Enforcement
 * @see Wave 0.2 — Deterministic migration patch
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PKG_ROOT = resolve(__dirname, '..');
const DRIZZLE_DIR = join(PKG_ROOT, 'drizzle');
const JOURNAL_PATH = join(DRIZZLE_DIR, 'meta', '_journal.json');

// ── NK Table Registry (must match helpers/natural-key-immutability.ts) ──

const NK_TABLES = {
  bank_accounts: ['account_no'],
  government_grant_items: ['grant_no'],
  payment_methods: ['code'],
  payment_terms_templates: ['code'],
  treasury_accounts: ['account_no'],
};

// ── Trigger SQL Generators ──────────────────────────────────────────────

function generateBlockFunctionSql() {
  return `-- Natural key immutability trigger function (shared)
CREATE OR REPLACE FUNCTION public.block_natural_key_update()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Natural key column(s) are immutable after creation';
END;
$$ LANGUAGE plpgsql;`;
}

function generateNkTriggerSql(tableName, columns) {
  const triggerName = `trg_nk_immutable_${tableName}`;
  const columnList = columns.join(', ');
  const whenClauses = columns.map((col) => `OLD.${col} IS DISTINCT FROM NEW.${col}`).join(' OR ');

  return `-- NK immutability: ${tableName} (${columnList})
DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName};
CREATE TRIGGER ${triggerName}
  BEFORE UPDATE OF ${columnList} ON ${tableName}
  FOR EACH ROW WHEN (${whenClauses})
  EXECUTE FUNCTION public.block_natural_key_update();`;
}

// ── Find Newest Migration ───────────────────────────────────────────────

function findNewestMigration() {
  const journal = JSON.parse(readFileSync(JOURNAL_PATH, 'utf-8'));
  const entries = journal.entries;
  if (!entries || entries.length === 0) {
    throw new Error('No migration entries in journal');
  }
  const newest = entries[entries.length - 1];
  const sqlFile = join(DRIZZLE_DIR, `${newest.tag}.sql`);
  return sqlFile;
}

// ── Patch Logic ─────────────────────────────────────────────────────────

const MARKER = '-- [NK-IMMUTABILITY-TRIGGERS]';

function patchMigration(sqlPath) {
  let content = readFileSync(sqlPath, 'utf-8');

  // If marker already present, strip old block and re-generate (idempotent)
  const markerIdx = content.indexOf(MARKER);
  if (markerIdx !== -1) {
    content = content.substring(0, markerIdx).trimEnd();
  }

  // Build trigger SQL block
  const parts = ['', MARKER, '', generateBlockFunctionSql(), ''];

  // Sort tables for determinism
  const sortedTables = Object.keys(NK_TABLES).sort();
  for (const table of sortedTables) {
    parts.push(generateNkTriggerSql(table, NK_TABLES[table]));
    parts.push('');
  }

  const patchBlock = parts.join('\n');
  const patched = content + '\n' + patchBlock;

  writeFileSync(sqlPath, patched, 'utf-8');
  return { sqlPath, tablesPatched: sortedTables.length };
}

// ── Verification ────────────────────────────────────────────────────────

function verify(sqlPath) {
  const content = readFileSync(sqlPath, 'utf-8');
  const errors = [];

  // Verify marker present
  if (!content.includes(MARKER)) {
    errors.push('Missing NK immutability marker in migration');
  }

  // Verify each table has its trigger
  for (const [table, columns] of Object.entries(NK_TABLES)) {
    const triggerName = `trg_nk_immutable_${table}`;
    if (!content.includes(triggerName)) {
      errors.push(`Missing trigger ${triggerName} for table ${table}`);
    }
    for (const col of columns) {
      if (!content.includes(`BEFORE UPDATE OF ${columns.join(', ')} ON ${table}`)) {
        errors.push(`Missing UPDATE OF ${col} clause for ${table}`);
        break;
      }
    }
  }

  // Verify shared function
  if (!content.includes('block_natural_key_update')) {
    errors.push('Missing block_natural_key_update function');
  }

  return errors;
}

// ── Main ────────────────────────────────────────────────────────────────

try {
  const sqlPath = findNewestMigration();
  console.log(`📄 Patching: ${sqlPath}`);

  const { tablesPatched } = patchMigration(sqlPath);
  console.log(`✅ Patched ${tablesPatched} NK triggers`);

  const errors = verify(sqlPath);
  if (errors.length > 0) {
    console.error('❌ Verification failed:');
    for (const err of errors) {
      console.error(`   - ${err}`);
    }
    process.exit(1);
  }

  console.log('✅ Verification passed — all NK triggers present');
} catch (err) {
  console.error(`❌ ${err.message}`);
  process.exit(1);
}
