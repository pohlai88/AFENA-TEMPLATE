// CRUD API handlers for Pegged Currency Details
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { peggedCurrencyDetails } from '../db/schema.js';
import { PeggedCurrencyDetailsSchema, PeggedCurrencyDetailsInsertSchema } from '../types/pegged-currency-details.js';

export const ROUTE_PREFIX = '/pegged-currency-details';

/**
 * List Pegged Currency Details records.
 */
export async function listPeggedCurrencyDetails(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(peggedCurrencyDetails).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Pegged Currency Details by ID.
 */
export async function getPeggedCurrencyDetails(db: any, id: string) {
  const rows = await db.select().from(peggedCurrencyDetails).where(eq(peggedCurrencyDetails.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Pegged Currency Details.
 */
export async function createPeggedCurrencyDetails(db: any, data: unknown) {
  const parsed = PeggedCurrencyDetailsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(peggedCurrencyDetails).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Pegged Currency Details.
 */
export async function updatePeggedCurrencyDetails(db: any, id: string, data: unknown) {
  const parsed = PeggedCurrencyDetailsInsertSchema.partial().parse(data);
  await db.update(peggedCurrencyDetails).set({ ...parsed, modified: new Date() }).where(eq(peggedCurrencyDetails.id, id));
  return getPeggedCurrencyDetails(db, id);
}

/**
 * Delete a Pegged Currency Details by ID.
 */
export async function deletePeggedCurrencyDetails(db: any, id: string) {
  await db.delete(peggedCurrencyDetails).where(eq(peggedCurrencyDetails.id, id));
  return { deleted: true, id };
}
