// CRUD API handlers for POS Invoice Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posInvoiceItem } from '../db/schema.js';
import { PosInvoiceItemSchema, PosInvoiceItemInsertSchema } from '../types/pos-invoice-item.js';

export const ROUTE_PREFIX = '/pos-invoice-item';

/**
 * List POS Invoice Item records.
 */
export async function listPosInvoiceItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posInvoiceItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Invoice Item by ID.
 */
export async function getPosInvoiceItem(db: any, id: string) {
  const rows = await db.select().from(posInvoiceItem).where(eq(posInvoiceItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Invoice Item.
 */
export async function createPosInvoiceItem(db: any, data: unknown) {
  const parsed = PosInvoiceItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posInvoiceItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Invoice Item.
 */
export async function updatePosInvoiceItem(db: any, id: string, data: unknown) {
  const parsed = PosInvoiceItemInsertSchema.partial().parse(data);
  await db.update(posInvoiceItem).set({ ...parsed, modified: new Date() }).where(eq(posInvoiceItem.id, id));
  return getPosInvoiceItem(db, id);
}

/**
 * Delete a POS Invoice Item by ID.
 */
export async function deletePosInvoiceItem(db: any, id: string) {
  await db.delete(posInvoiceItem).where(eq(posInvoiceItem.id, id));
  return { deleted: true, id };
}
