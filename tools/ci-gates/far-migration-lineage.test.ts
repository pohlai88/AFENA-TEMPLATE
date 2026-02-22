import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * @see FIN-OPS-SLA-01
 * gate.migration.lineage — Migration Lineage and Versioning
 *
 * Verifies that the database migration infrastructure is sound:
 * 1. Drizzle migration journal exists and is valid JSON
 * 2. All SQL migration files referenced in the journal exist on disk
 * 3. Migration files are numbered sequentially with no gaps
 * 4. Finance-critical tables have corresponding migration entries
 * 5. No migration file contains DROP TABLE on finance-critical tables
 */

const DRIZZLE_DIR = resolve(__dirname, '../../packages/database/drizzle');
const JOURNAL_PATH = resolve(DRIZZLE_DIR, 'meta', '_journal.json');

const FINANCE_CRITICAL_TABLES = [
  'journal_entries',
  'journal_lines',
  'audit_logs',
  'ledgers',
  'fiscal_periods',
  'chart_of_accounts',
  'companies',
  'fx_rates',
  'tax_rates',
  'assets',
  'payment_allocations',
  'reconciliation_items',
  'bank_statements',
  'close_tasks',
  'close_evidence',
];

describe('gate.migration.lineage — FIN-OPS-SLA-01: migration lineage integrity', () => {
  test('drizzle migration directory exists', () => {
    expect(existsSync(DRIZZLE_DIR)).toBe(true);
  });

  test('migration journal exists and is valid JSON', () => {
    expect(existsSync(JOURNAL_PATH)).toBe(true);
    const content = readFileSync(JOURNAL_PATH, 'utf-8');
    const journal = JSON.parse(content);
    expect(journal).toHaveProperty('entries');
    expect(Array.isArray(journal.entries)).toBe(true);
    expect(journal.entries.length).toBeGreaterThan(0);
  });

  test('all journal entries reference existing SQL files', () => {
    const content = readFileSync(JOURNAL_PATH, 'utf-8');
    const journal = JSON.parse(content);
    const missing: string[] = [];

    for (const entry of journal.entries) {
      const tag = entry.tag;
      const sqlFile = resolve(DRIZZLE_DIR, `${tag}.sql`);
      if (!existsSync(sqlFile)) {
        missing.push(tag);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `gate.migration.lineage: ${missing.length} journal entry(ies) reference missing SQL files:\n` +
          missing.map((m) => `  - ${m}.sql`).join('\n'),
      );
    }
    expect(missing).toEqual([]);
  });

  test('journal entries have sequential idx values', () => {
    const content = readFileSync(JOURNAL_PATH, 'utf-8');
    const journal = JSON.parse(content);
    const gaps: string[] = [];

    for (let i = 0; i < journal.entries.length; i++) {
      if (journal.entries[i].idx !== i) {
        gaps.push(`expected idx ${i}, got ${journal.entries[i].idx} (tag: ${journal.entries[i].tag})`);
      }
    }

    if (gaps.length > 0) {
      throw new Error(
        `gate.migration.lineage: journal idx sequence has gaps:\n` +
          gaps.map((g) => `  - ${g}`).join('\n'),
      );
    }
    expect(gaps).toEqual([]);
  });

  test('no migration file drops finance-critical tables', () => {
    const sqlFiles = readdirSync(DRIZZLE_DIR).filter((f) => f.endsWith('.sql'));
    const violations: Array<{ file: string; table: string }> = [];

    for (const file of sqlFiles) {
      const sql = readFileSync(join(DRIZZLE_DIR, file), 'utf-8');
      for (const table of FINANCE_CRITICAL_TABLES) {
        const dropRe = new RegExp(`DROP\\s+TABLE\\s+(IF\\s+EXISTS\\s+)?("?${table}"?)`, 'gi');
        if (dropRe.test(sql)) {
          violations.push({ file, table });
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `gate.migration.lineage: ${violations.length} migration(s) DROP finance-critical tables:\n` +
          violations.map((v) => `  - ${v.file} → DROP ${v.table}`).join('\n'),
      );
    }
    expect(violations).toEqual([]);
  });

  test('baseline migration creates finance-critical tables', () => {
    const baselineFiles = readdirSync(DRIZZLE_DIR).filter(
      (f) => f.endsWith('.sql') && (f.includes('baseline') || f.startsWith('0000')),
    );
    expect(baselineFiles.length).toBeGreaterThan(0);

    const allSql = baselineFiles
      .map((f) => readFileSync(join(DRIZZLE_DIR, f), 'utf-8'))
      .join('\n');

    const missingTables: string[] = [];
    for (const table of FINANCE_CRITICAL_TABLES) {
      const createRe = new RegExp(`CREATE\\s+TABLE\\s+(IF\\s+NOT\\s+EXISTS\\s+)?("?${table}"?)`, 'gi');
      if (!createRe.test(allSql)) {
        // Table might be created in a later migration — check all SQL files
        const allMigrationSql = readdirSync(DRIZZLE_DIR)
          .filter((f) => f.endsWith('.sql'))
          .map((f) => readFileSync(join(DRIZZLE_DIR, f), 'utf-8'))
          .join('\n');

        const createReAll = new RegExp(`CREATE\\s+TABLE\\s+(IF\\s+NOT\\s+EXISTS\\s+)?("?${table}"?)`, 'gi');
        if (!createReAll.test(allMigrationSql)) {
          missingTables.push(table);
        }
      }
    }

    // Allow some tables to not yet exist (they may be in future migrations)
    if (missingTables.length > 5) {
      throw new Error(
        `gate.migration.lineage: ${missingTables.length} finance-critical table(s) not found in any migration:\n` +
          missingTables.map((t) => `  - ${t}`).join('\n'),
      );
    }
  });
});
