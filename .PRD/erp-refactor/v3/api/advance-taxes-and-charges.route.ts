// CRUD API handlers for Advance Taxes and Charges
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { advanceTaxesAndCharges } from '../db/schema.js';
import { AdvanceTaxesAndChargesSchema, AdvanceTaxesAndChargesInsertSchema } from '../types/advance-taxes-and-charges.js';

export const ROUTE_PREFIX = '/advance-taxes-and-charges';

/**
 * List Advance Taxes and Charges records.
 */
export async function listAdvanceTaxesAndCharges(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(advanceTaxesAndCharges).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Advance Taxes and Charges by ID.
 */
export async function getAdvanceTaxesAndCharges(db: any, id: string) {
  const rows = await db.select().from(advanceTaxesAndCharges).where(eq(advanceTaxesAndCharges.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Advance Taxes and Charges.
 */
export async function createAdvanceTaxesAndCharges(db: any, data: unknown) {
  const parsed = AdvanceTaxesAndChargesInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(advanceTaxesAndCharges).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Advance Taxes and Charges.
 */
export async function updateAdvanceTaxesAndCharges(db: any, id: string, data: unknown) {
  const parsed = AdvanceTaxesAndChargesInsertSchema.partial().parse(data);
  await db.update(advanceTaxesAndCharges).set({ ...parsed, modified: new Date() }).where(eq(advanceTaxesAndCharges.id, id));
  return getAdvanceTaxesAndCharges(db, id);
}

/**
 * Delete a Advance Taxes and Charges by ID.
 */
export async function deleteAdvanceTaxesAndCharges(db: any, id: string) {
  await db.delete(advanceTaxesAndCharges).where(eq(advanceTaxesAndCharges.id, id));
  return { deleted: true, id };
}
