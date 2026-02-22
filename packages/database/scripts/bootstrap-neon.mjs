#!/usr/bin/env node
/**
 * Bootstrap Neon — Programmatic Runner
 *
 * Reads bootstrap-neon.sql and executes each statement against the
 * target Neon database via @neondatabase/serverless WebSocket Pool.
 *
 * Uses DATABASE_URL_MIGRATIONS (direct, non-pooled) for DDL safety.
 *
 * Usage:
 *   node scripts/bootstrap-neon.mjs
 *   DATABASE_URL_MIGRATIONS=... node scripts/bootstrap-neon.mjs
 */

import dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { Pool } from '@neondatabase/serverless';

// ── Resolve .env ─────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
let dir = join(__dirname, '..');
for (let i = 0; i < 5; i++) {
  const candidate = join(dir, '.env');
  if (existsSync(candidate)) {
    dotenv.config({ path: candidate });
    break;
  }
  dir = dirname(dir);
}

const url = process.env.DATABASE_URL_MIGRATIONS ?? process.env.DATABASE_URL;
if (!url) {
  console.error('❌ DATABASE_URL_MIGRATIONS (or DATABASE_URL) is not set');
  process.exit(1);
}

// ── Read SQL ─────────────────────────────────────────────────────────────────

const sqlPath = join(__dirname, 'bootstrap-neon.sql');
if (!existsSync(sqlPath)) {
  console.error(`❌ Bootstrap SQL not found: ${sqlPath}`);
  process.exit(1);
}

const rawSql = readFileSync(sqlPath, 'utf-8');

// Split into executable blocks.
// We split on blank lines between top-level statements, but we must
// keep DO $$ ... $$ blocks together.  Strategy: split on the
// Drizzle-style `--> statement-breakpoint` marker — but our bootstrap
// doesn't use it, so split on double-newlines outside $$ blocks.
//
// Simpler approach: execute the entire file as one statement via the
// Pool client which supports multi-statement queries in a transaction.

const host = url.split('@')[1]?.split('/')[0] ?? 'unknown';
console.log(`🔌 Connecting to: ${host}`);
console.log(`📂 Bootstrap SQL : ${sqlPath}`);

const pool = new Pool({ connectionString: url });

try {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(rawSql);
    await client.query('COMMIT');
    console.log('✅ Bootstrap completed successfully');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('❌ Bootstrap failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}
