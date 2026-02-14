// CRUD API handlers for Blanket Order Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { blanketOrderItem } from '../db/schema.js';
import { BlanketOrderItemSchema, BlanketOrderItemInsertSchema } from '../types/blanket-order-item.js';

export const ROUTE_PREFIX = '/blanket-order-item';

/**
 * List Blanket Order Item records.
 */
export async function listBlanketOrderItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(blanketOrderItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Blanket Order Item by ID.
 */
export async function getBlanketOrderItem(db: any, id: string) {
  const rows = await db.select().from(blanketOrderItem).where(eq(blanketOrderItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Blanket Order Item.
 */
export async function createBlanketOrderItem(db: any, data: unknown) {
  const parsed = BlanketOrderItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(blanketOrderItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Blanket Order Item.
 */
export async function updateBlanketOrderItem(db: any, id: string, data: unknown) {
  const parsed = BlanketOrderItemInsertSchema.partial().parse(data);
  await db.update(blanketOrderItem).set({ ...parsed, modified: new Date() }).where(eq(blanketOrderItem.id, id));
  return getBlanketOrderItem(db, id);
}

/**
 * Delete a Blanket Order Item by ID.
 */
export async function deleteBlanketOrderItem(db: any, id: string) {
  await db.delete(blanketOrderItem).where(eq(blanketOrderItem.id, id));
  return { deleted: true, id };
}
