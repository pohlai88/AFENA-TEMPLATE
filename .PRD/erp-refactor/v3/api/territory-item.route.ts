// CRUD API handlers for Territory Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { territoryItem } from '../db/schema.js';
import { TerritoryItemSchema, TerritoryItemInsertSchema } from '../types/territory-item.js';

export const ROUTE_PREFIX = '/territory-item';

/**
 * List Territory Item records.
 */
export async function listTerritoryItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(territoryItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Territory Item by ID.
 */
export async function getTerritoryItem(db: any, id: string) {
  const rows = await db.select().from(territoryItem).where(eq(territoryItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Territory Item.
 */
export async function createTerritoryItem(db: any, data: unknown) {
  const parsed = TerritoryItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(territoryItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Territory Item.
 */
export async function updateTerritoryItem(db: any, id: string, data: unknown) {
  const parsed = TerritoryItemInsertSchema.partial().parse(data);
  await db.update(territoryItem).set({ ...parsed, modified: new Date() }).where(eq(territoryItem.id, id));
  return getTerritoryItem(db, id);
}

/**
 * Delete a Territory Item by ID.
 */
export async function deleteTerritoryItem(db: any, id: string) {
  await db.delete(territoryItem).where(eq(territoryItem.id, id));
  return { deleted: true, id };
}
