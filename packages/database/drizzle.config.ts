import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const migrationUrl = process.env.DATABASE_URL_MIGRATIONS ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error('DATABASE_URL_MIGRATIONS (or DATABASE_URL) is not set in .env file');
}

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: migrationUrl,
  },
});
