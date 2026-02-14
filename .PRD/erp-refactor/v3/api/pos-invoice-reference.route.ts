// CRUD API handlers for POS Invoice Reference
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posInvoiceReference } from '../db/schema.js';
import { PosInvoiceReferenceSchema, PosInvoiceReferenceInsertSchema } from '../types/pos-invoice-reference.js';

export const ROUTE_PREFIX = '/pos-invoice-reference';

/**
 * List POS Invoice Reference records.
 */
export async function listPosInvoiceReference(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posInvoiceReference).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Invoice Reference by ID.
 */
export async function getPosInvoiceReference(db: any, id: string) {
  const rows = await db.select().from(posInvoiceReference).where(eq(posInvoiceReference.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Invoice Reference.
 */
export async function createPosInvoiceReference(db: any, data: unknown) {
  const parsed = PosInvoiceReferenceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posInvoiceReference).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Invoice Reference.
 */
export async function updatePosInvoiceReference(db: any, id: string, data: unknown) {
  const parsed = PosInvoiceReferenceInsertSchema.partial().parse(data);
  await db.update(posInvoiceReference).set({ ...parsed, modified: new Date() }).where(eq(posInvoiceReference.id, id));
  return getPosInvoiceReference(db, id);
}

/**
 * Delete a POS Invoice Reference by ID.
 */
export async function deletePosInvoiceReference(db: any, id: string) {
  await db.delete(posInvoiceReference).where(eq(posInvoiceReference.id, id));
  return { deleted: true, id };
}
