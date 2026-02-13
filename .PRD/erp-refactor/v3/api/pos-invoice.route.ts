// CRUD API handlers for POS Invoice
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posInvoice } from '../db/schema.js';
import { PosInvoiceSchema, PosInvoiceInsertSchema } from '../types/pos-invoice.js';

export const ROUTE_PREFIX = '/pos-invoice';

/**
 * List POS Invoice records.
 */
export async function listPosInvoice(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posInvoice).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Invoice by ID.
 */
export async function getPosInvoice(db: any, id: string) {
  const rows = await db.select().from(posInvoice).where(eq(posInvoice.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Invoice.
 */
export async function createPosInvoice(db: any, data: unknown) {
  const parsed = PosInvoiceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posInvoice).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Invoice.
 */
export async function updatePosInvoice(db: any, id: string, data: unknown) {
  const parsed = PosInvoiceInsertSchema.partial().parse(data);
  await db.update(posInvoice).set({ ...parsed, modified: new Date() }).where(eq(posInvoice.id, id));
  return getPosInvoice(db, id);
}

/**
 * Delete a POS Invoice by ID.
 */
export async function deletePosInvoice(db: any, id: string) {
  await db.delete(posInvoice).where(eq(posInvoice.id, id));
  return { deleted: true, id };
}

/**
 * Submit a POS Invoice (set docstatus = 1).
 */
export async function submitPosInvoice(db: any, id: string) {
  await db.update(posInvoice).set({ docstatus: 1, modified: new Date() }).where(eq(posInvoice.id, id));
  return getPosInvoice(db, id);
}

/**
 * Cancel a POS Invoice (set docstatus = 2).
 */
export async function cancelPosInvoice(db: any, id: string) {
  await db.update(posInvoice).set({ docstatus: 2, modified: new Date() }).where(eq(posInvoice.id, id));
  return getPosInvoice(db, id);
}
