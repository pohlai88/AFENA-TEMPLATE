// CRUD API handlers for Fiscal Year Company
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { fiscalYearCompany } from '../db/schema.js';
import { FiscalYearCompanySchema, FiscalYearCompanyInsertSchema } from '../types/fiscal-year-company.js';

export const ROUTE_PREFIX = '/fiscal-year-company';

/**
 * List Fiscal Year Company records.
 */
export async function listFiscalYearCompany(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(fiscalYearCompany).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Fiscal Year Company by ID.
 */
export async function getFiscalYearCompany(db: any, id: string) {
  const rows = await db.select().from(fiscalYearCompany).where(eq(fiscalYearCompany.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Fiscal Year Company.
 */
export async function createFiscalYearCompany(db: any, data: unknown) {
  const parsed = FiscalYearCompanyInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(fiscalYearCompany).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Fiscal Year Company.
 */
export async function updateFiscalYearCompany(db: any, id: string, data: unknown) {
  const parsed = FiscalYearCompanyInsertSchema.partial().parse(data);
  await db.update(fiscalYearCompany).set({ ...parsed, modified: new Date() }).where(eq(fiscalYearCompany.id, id));
  return getFiscalYearCompany(db, id);
}

/**
 * Delete a Fiscal Year Company by ID.
 */
export async function deleteFiscalYearCompany(db: any, id: string) {
  await db.delete(fiscalYearCompany).where(eq(fiscalYearCompany.id, id));
  return { deleted: true, id };
}
