import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema/index';

/** Append sslnegotiation=direct for PG17 (reduces cold-start per Neon docs). */
function ensureConnectionParams(url: string): string {
  if (url.includes('sslnegotiation=')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}sslnegotiation=direct`;
}

const rawDatabaseUrl = process.env.DATABASE_URL;
if (!rawDatabaseUrl) {
  throw new Error('DATABASE_URL is not set');
}
const databaseUrl = ensureConnectionParams(rawDatabaseUrl);

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
const rawDatabaseUrlRo = process.env.DATABASE_URL_RO ?? rawDatabaseUrl;
const databaseUrlRo = rawDatabaseUrlRo === rawDatabaseUrl ? databaseUrl : ensureConnectionParams(rawDatabaseUrlRo);
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

/**
 * Worker DB — for search drain/bootstrap (GAP-DB-004).
 * Uses SEARCH_WORKER_DATABASE_URL when set (BYPASSRLS role for multi-tenant).
 * Falls back to DATABASE_URL for local dev.
 */
const rawWorkerUrl = process.env.SEARCH_WORKER_DATABASE_URL ?? rawDatabaseUrl;
const workerUrl = rawWorkerUrl === rawDatabaseUrl ? databaseUrl : ensureConnectionParams(rawWorkerUrl);
const sqlWorker = workerUrl === databaseUrl ? sqlRw : neon(workerUrl);

export const dbSearchWorker = drizzle(sqlWorker, {
  schema,
  logger: isDev,
});
