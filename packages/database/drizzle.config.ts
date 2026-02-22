import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { existsSync } from 'fs';
import { dirname, join } from 'path';

// Walk up from cwd to find monorepo root .env
let dir = process.cwd();
for (let i = 0; i < 5; i++) {
  const candidate = join(dir, '.env');
  if (existsSync(candidate)) {
    dotenv.config({ path: candidate });
    break;
  }
  dir = dirname(dir);
}

const migrationUrl = process.env.DATABASE_URL_MIGRATIONS ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error('DATABASE_URL_MIGRATIONS (or DATABASE_URL) is not set in .env file');
}

export default defineConfig({
  schema: ['./src/schema/*.ts', './src/helpers/doc-status.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: migrationUrl,
  },
  migrations: {
    schema: 'drizzle',
    table: '__drizzle_migrations',
  },
});
