// CRUD API handlers for Blanket Order
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { blanketOrder } from '../db/schema.js';
import { BlanketOrderSchema, BlanketOrderInsertSchema } from '../types/blanket-order.js';

export const ROUTE_PREFIX = '/blanket-order';

/**
 * List Blanket Order records.
 */
export async function listBlanketOrder(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(blanketOrder).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Blanket Order by ID.
 */
export async function getBlanketOrder(db: any, id: string) {
  const rows = await db.select().from(blanketOrder).where(eq(blanketOrder.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Blanket Order.
 */
export async function createBlanketOrder(db: any, data: unknown) {
  const parsed = BlanketOrderInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(blanketOrder).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Blanket Order.
 */
export async function updateBlanketOrder(db: any, id: string, data: unknown) {
  const parsed = BlanketOrderInsertSchema.partial().parse(data);
  await db.update(blanketOrder).set({ ...parsed, modified: new Date() }).where(eq(blanketOrder.id, id));
  return getBlanketOrder(db, id);
}

/**
 * Delete a Blanket Order by ID.
 */
export async function deleteBlanketOrder(db: any, id: string) {
  await db.delete(blanketOrder).where(eq(blanketOrder.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Blanket Order (set docstatus = 1).
 */
export async function submitBlanketOrder(db: any, id: string) {
  await db.update(blanketOrder).set({ docstatus: 1, modified: new Date() }).where(eq(blanketOrder.id, id));
  return getBlanketOrder(db, id);
}

/**
 * Cancel a Blanket Order (set docstatus = 2).
 */
export async function cancelBlanketOrder(db: any, id: string) {
  await db.update(blanketOrder).set({ docstatus: 2, modified: new Date() }).where(eq(blanketOrder.id, id));
  return getBlanketOrder(db, id);
}
