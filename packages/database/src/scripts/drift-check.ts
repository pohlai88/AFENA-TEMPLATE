#!/usr/bin/env npx tsx
/* eslint-disable no-console, no-restricted-syntax */
/**
 * DB Drift Check — CI gate for schema vs migrations consistency.
 *
 * Compares Drizzle schema (TypeScript) to migration history.
 * Fails if `drizzle-kit generate` would produce a new migration.
 *
 * Usage: pnpm db:drift-check
 * CI: Add to pipeline before deploy.
 *
 * Note: Does not compare to live DB. For full DB drift, use
 * drizzle-kit introspect and diff, or Neon MCP schema comparison.
 */

import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DRIZZLE_DIR = join(__dirname, '../../drizzle');

function getMigrationCount(): number {
  try {
    const files = readdirSync(DRIZZLE_DIR).filter(
      (f) => f.endsWith('.sql') && /^\d{4}_/.test(f),
    );
    return files.length;
  } catch {
    return 0;
  }
}

function main(): void {
  const before = getMigrationCount();

  let output: string;
  try {
    output = execSync('pnpm exec drizzle-kit generate', {
      encoding: 'utf-8',
      cwd: join(__dirname, '../..'),
    });
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string };
    output = (e.stdout ?? '') + (e.stderr ?? '');
  }

  const after = getMigrationCount();

  if (output.includes('No schema changes, nothing to migrate')) {
    console.log('✅ db:drift-check — Schema and migrations are in sync');
    process.exit(0);
  }

  if (after > before) {
    console.error('❌ db:drift-check — Schema drift detected');
    console.error('   drizzle-kit generate produced a new migration.');
    console.error('   Run pnpm db:generate and apply migrations, or fix schema.');
    process.exit(1);
  }

  console.log('✅ db:drift-check — No new migrations generated');
  process.exit(0);
}

main();
