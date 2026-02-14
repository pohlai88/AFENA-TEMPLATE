// CRUD API handlers for POS Closing Entry Taxes
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posClosingEntryTaxes } from '../db/schema.js';
import { PosClosingEntryTaxesSchema, PosClosingEntryTaxesInsertSchema } from '../types/pos-closing-entry-taxes.js';

export const ROUTE_PREFIX = '/pos-closing-entry-taxes';

/**
 * List POS Closing Entry Taxes records.
 */
export async function listPosClosingEntryTaxes(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posClosingEntryTaxes).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Closing Entry Taxes by ID.
 */
export async function getPosClosingEntryTaxes(db: any, id: string) {
  const rows = await db.select().from(posClosingEntryTaxes).where(eq(posClosingEntryTaxes.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Closing Entry Taxes.
 */
export async function createPosClosingEntryTaxes(db: any, data: unknown) {
  const parsed = PosClosingEntryTaxesInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posClosingEntryTaxes).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Closing Entry Taxes.
 */
export async function updatePosClosingEntryTaxes(db: any, id: string, data: unknown) {
  const parsed = PosClosingEntryTaxesInsertSchema.partial().parse(data);
  await db.update(posClosingEntryTaxes).set({ ...parsed, modified: new Date() }).where(eq(posClosingEntryTaxes.id, id));
  return getPosClosingEntryTaxes(db, id);
}

/**
 * Delete a POS Closing Entry Taxes by ID.
 */
export async function deletePosClosingEntryTaxes(db: any, id: string) {
  await db.delete(posClosingEntryTaxes).where(eq(posClosingEntryTaxes.id, id));
  return { deleted: true, id };
}
