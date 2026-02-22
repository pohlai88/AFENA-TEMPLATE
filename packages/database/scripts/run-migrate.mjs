/**
 * Programmatic migration runner for Neon.
 *
 * Workaround for drizzle-kit CLI not resolving drivers in pnpm monorepos.
 * Uses @neondatabase/serverless WebSocket adapter for DDL transaction support.
 *
 * Usage: node scripts/run-migrate.mjs
 */
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';

// Walk up to find .env
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

const host = url.split('@')[1]?.split('/')[0] ?? 'unknown';
console.log(`🔌 Connecting to: ${host}`);
console.log(`📂 Migrations folder: ./drizzle`);

const pool = new Pool({ connectionString: url });
const db = drizzle({ client: pool });

try {
  await migrate(db, {
    migrationsFolder: join(__dirname, '..', 'drizzle'),
    migrationsSchema: 'drizzle',
    migrationsTable: '__drizzle_migrations',
  });
  console.log('✅ Migrations applied successfully');
} catch (err) {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
} finally {
  await pool.end();
}
