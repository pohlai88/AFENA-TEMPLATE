// CRUD API handlers for Tax Withholding Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { taxWithholdingEntry } from '../db/schema.js';
import { TaxWithholdingEntrySchema, TaxWithholdingEntryInsertSchema } from '../types/tax-withholding-entry.js';

export const ROUTE_PREFIX = '/tax-withholding-entry';

/**
 * List Tax Withholding Entry records.
 */
export async function listTaxWithholdingEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(taxWithholdingEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Tax Withholding Entry by ID.
 */
export async function getTaxWithholdingEntry(db: any, id: string) {
  const rows = await db.select().from(taxWithholdingEntry).where(eq(taxWithholdingEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Tax Withholding Entry.
 */
export async function createTaxWithholdingEntry(db: any, data: unknown) {
  const parsed = TaxWithholdingEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(taxWithholdingEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Tax Withholding Entry.
 */
export async function updateTaxWithholdingEntry(db: any, id: string, data: unknown) {
  const parsed = TaxWithholdingEntryInsertSchema.partial().parse(data);
  await db.update(taxWithholdingEntry).set({ ...parsed, modified: new Date() }).where(eq(taxWithholdingEntry.id, id));
  return getTaxWithholdingEntry(db, id);
}

/**
 * Delete a Tax Withholding Entry by ID.
 */
export async function deleteTaxWithholdingEntry(db: any, id: string) {
  await db.delete(taxWithholdingEntry).where(eq(taxWithholdingEntry.id, id));
  return { deleted: true, id };
}
