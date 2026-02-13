// CRUD API handlers for Pegged Currencies
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { peggedCurrencies } from '../db/schema.js';
import { PeggedCurrenciesSchema, PeggedCurrenciesInsertSchema } from '../types/pegged-currencies.js';

export const ROUTE_PREFIX = '/pegged-currencies';

/**
 * List Pegged Currencies records.
 */
export async function listPeggedCurrencies(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(peggedCurrencies).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Pegged Currencies by ID.
 */
export async function getPeggedCurrencies(db: any, id: string) {
  const rows = await db.select().from(peggedCurrencies).where(eq(peggedCurrencies.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Pegged Currencies.
 */
export async function createPeggedCurrencies(db: any, data: unknown) {
  const parsed = PeggedCurrenciesInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(peggedCurrencies).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Pegged Currencies.
 */
export async function updatePeggedCurrencies(db: any, id: string, data: unknown) {
  const parsed = PeggedCurrenciesInsertSchema.partial().parse(data);
  await db.update(peggedCurrencies).set({ ...parsed, modified: new Date() }).where(eq(peggedCurrencies.id, id));
  return getPeggedCurrencies(db, id);
}

/**
 * Delete a Pegged Currencies by ID.
 */
export async function deletePeggedCurrencies(db: any, id: string) {
  await db.delete(peggedCurrencies).where(eq(peggedCurrencies.id, id));
  return { deleted: true, id };
}
