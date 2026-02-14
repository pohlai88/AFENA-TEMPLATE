// CRUD API handlers for Chart of Accounts Importer
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { chartOfAccountsImporter } from '../db/schema.js';
import { ChartOfAccountsImporterSchema, ChartOfAccountsImporterInsertSchema } from '../types/chart-of-accounts-importer.js';

export const ROUTE_PREFIX = '/chart-of-accounts-importer';

/**
 * List Chart of Accounts Importer records.
 */
export async function listChartOfAccountsImporter(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(chartOfAccountsImporter).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Chart of Accounts Importer by ID.
 */
export async function getChartOfAccountsImporter(db: any, id: string) {
  const rows = await db.select().from(chartOfAccountsImporter).where(eq(chartOfAccountsImporter.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Chart of Accounts Importer.
 */
export async function createChartOfAccountsImporter(db: any, data: unknown) {
  const parsed = ChartOfAccountsImporterInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(chartOfAccountsImporter).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Chart of Accounts Importer.
 */
export async function updateChartOfAccountsImporter(db: any, id: string, data: unknown) {
  const parsed = ChartOfAccountsImporterInsertSchema.partial().parse(data);
  await db.update(chartOfAccountsImporter).set({ ...parsed, modified: new Date() }).where(eq(chartOfAccountsImporter.id, id));
  return getChartOfAccountsImporter(db, id);
}

/**
 * Delete a Chart of Accounts Importer by ID.
 */
export async function deleteChartOfAccountsImporter(db: any, id: string) {
  await db.delete(chartOfAccountsImporter).where(eq(chartOfAccountsImporter.id, id));
  return { deleted: true, id };
}
