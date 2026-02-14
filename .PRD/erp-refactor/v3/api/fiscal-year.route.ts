// CRUD API handlers for Fiscal Year
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { fiscalYear } from '../db/schema.js';
import { FiscalYearSchema, FiscalYearInsertSchema } from '../types/fiscal-year.js';

export const ROUTE_PREFIX = '/fiscal-year';

/**
 * List Fiscal Year records.
 */
export async function listFiscalYear(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(fiscalYear).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Fiscal Year by ID.
 */
export async function getFiscalYear(db: any, id: string) {
  const rows = await db.select().from(fiscalYear).where(eq(fiscalYear.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Fiscal Year.
 */
export async function createFiscalYear(db: any, data: unknown) {
  const parsed = FiscalYearInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(fiscalYear).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Fiscal Year.
 */
export async function updateFiscalYear(db: any, id: string, data: unknown) {
  const parsed = FiscalYearInsertSchema.partial().parse(data);
  await db.update(fiscalYear).set({ ...parsed, modified: new Date() }).where(eq(fiscalYear.id, id));
  return getFiscalYear(db, id);
}

/**
 * Delete a Fiscal Year by ID.
 */
export async function deleteFiscalYear(db: any, id: string) {
  await db.delete(fiscalYear).where(eq(fiscalYear.id, id));
  return { deleted: true, id };
}
