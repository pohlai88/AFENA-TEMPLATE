import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema/index';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const isDev = process.env.NODE_ENV === 'development';

const sqlRw = neon(databaseUrl);

/** Read-write compute — writes + transactional reads */
export const db = drizzle(sqlRw, {
  schema,
  logger: isDev,
});

/**
 * Read-only compute — list pages, dashboards, search, reporting.
 * Falls back to RW connection if DATABASE_URL_RO is not set (dev/preview).
 */
const databaseUrlRo = process.env.DATABASE_URL_RO ?? databaseUrl;
const sqlRo = databaseUrlRo === databaseUrl ? sqlRw : neon(databaseUrlRo);

export const dbRo = drizzle(sqlRo, {
  schema,
  logger: isDev,
});

export type DbInstance = typeof db;

/**
 * Returns the appropriate DB instance.
 * Use `forcePrimary: true` for read-after-write consistency.
 */
export function getDb(options?: { forcePrimary?: boolean }): DbInstance {
  return options?.forcePrimary ? db : dbRo;
}
