// CRUD API handlers for Packing Slip Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { packingSlipItem } from '../db/schema.js';
import { PackingSlipItemSchema, PackingSlipItemInsertSchema } from '../types/packing-slip-item.js';

export const ROUTE_PREFIX = '/packing-slip-item';

/**
 * List Packing Slip Item records.
 */
export async function listPackingSlipItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(packingSlipItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Packing Slip Item by ID.
 */
export async function getPackingSlipItem(db: any, id: string) {
  const rows = await db.select().from(packingSlipItem).where(eq(packingSlipItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Packing Slip Item.
 */
export async function createPackingSlipItem(db: any, data: unknown) {
  const parsed = PackingSlipItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(packingSlipItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Packing Slip Item.
 */
export async function updatePackingSlipItem(db: any, id: string, data: unknown) {
  const parsed = PackingSlipItemInsertSchema.partial().parse(data);
  await db.update(packingSlipItem).set({ ...parsed, modified: new Date() }).where(eq(packingSlipItem.id, id));
  return getPackingSlipItem(db, id);
}

/**
 * Delete a Packing Slip Item by ID.
 */
export async function deletePackingSlipItem(db: any, id: string) {
  await db.delete(packingSlipItem).where(eq(packingSlipItem.id, id));
  return { deleted: true, id };
}
