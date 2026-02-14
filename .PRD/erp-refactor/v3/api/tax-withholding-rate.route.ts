// CRUD API handlers for Tax Withholding Rate
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { taxWithholdingRate } from '../db/schema.js';
import { TaxWithholdingRateSchema, TaxWithholdingRateInsertSchema } from '../types/tax-withholding-rate.js';

export const ROUTE_PREFIX = '/tax-withholding-rate';

/**
 * List Tax Withholding Rate records.
 */
export async function listTaxWithholdingRate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(taxWithholdingRate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Tax Withholding Rate by ID.
 */
export async function getTaxWithholdingRate(db: any, id: string) {
  const rows = await db.select().from(taxWithholdingRate).where(eq(taxWithholdingRate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Tax Withholding Rate.
 */
export async function createTaxWithholdingRate(db: any, data: unknown) {
  const parsed = TaxWithholdingRateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(taxWithholdingRate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Tax Withholding Rate.
 */
export async function updateTaxWithholdingRate(db: any, id: string, data: unknown) {
  const parsed = TaxWithholdingRateInsertSchema.partial().parse(data);
  await db.update(taxWithholdingRate).set({ ...parsed, modified: new Date() }).where(eq(taxWithholdingRate.id, id));
  return getTaxWithholdingRate(db, id);
}

/**
 * Delete a Tax Withholding Rate by ID.
 */
export async function deleteTaxWithholdingRate(db: any, id: string) {
  await db.delete(taxWithholdingRate).where(eq(taxWithholdingRate.id, id));
  return { deleted: true, id };
}
