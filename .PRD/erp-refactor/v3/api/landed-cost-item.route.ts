// CRUD API handlers for Landed Cost Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { landedCostItem } from '../db/schema.js';
import { LandedCostItemSchema, LandedCostItemInsertSchema } from '../types/landed-cost-item.js';

export const ROUTE_PREFIX = '/landed-cost-item';

/**
 * List Landed Cost Item records.
 */
export async function listLandedCostItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(landedCostItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Landed Cost Item by ID.
 */
export async function getLandedCostItem(db: any, id: string) {
  const rows = await db.select().from(landedCostItem).where(eq(landedCostItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Landed Cost Item.
 */
export async function createLandedCostItem(db: any, data: unknown) {
  const parsed = LandedCostItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(landedCostItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Landed Cost Item.
 */
export async function updateLandedCostItem(db: any, id: string, data: unknown) {
  const parsed = LandedCostItemInsertSchema.partial().parse(data);
  await db.update(landedCostItem).set({ ...parsed, modified: new Date() }).where(eq(landedCostItem.id, id));
  return getLandedCostItem(db, id);
}

/**
 * Delete a Landed Cost Item by ID.
 */
export async function deleteLandedCostItem(db: any, id: string) {
  await db.delete(landedCostItem).where(eq(landedCostItem.id, id));
  return { deleted: true, id };
}
