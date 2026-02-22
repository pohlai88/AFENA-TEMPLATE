/**
 * CI-only Drizzle Kit config — no database credentials.
 *
 * Used by offline gates (generate, check, export) that only need
 * the schema files and dialect, not a live DB connection.
 *
 * The main drizzle.config.ts throws if DATABASE_URL_MIGRATIONS is
 * missing, so CI jobs that run without secrets must use this config.
 */
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./src/schema/*.ts', './src/helpers/doc-status.ts'],
  out: './drizzle',
  dialect: 'postgresql',
});
