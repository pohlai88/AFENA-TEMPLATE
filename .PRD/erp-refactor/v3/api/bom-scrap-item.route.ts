// CRUD API handlers for BOM Scrap Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomScrapItem } from '../db/schema.js';
import { BomScrapItemSchema, BomScrapItemInsertSchema } from '../types/bom-scrap-item.js';

export const ROUTE_PREFIX = '/bom-scrap-item';

/**
 * List BOM Scrap Item records.
 */
export async function listBomScrapItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomScrapItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Scrap Item by ID.
 */
export async function getBomScrapItem(db: any, id: string) {
  const rows = await db.select().from(bomScrapItem).where(eq(bomScrapItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Scrap Item.
 */
export async function createBomScrapItem(db: any, data: unknown) {
  const parsed = BomScrapItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomScrapItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Scrap Item.
 */
export async function updateBomScrapItem(db: any, id: string, data: unknown) {
  const parsed = BomScrapItemInsertSchema.partial().parse(data);
  await db.update(bomScrapItem).set({ ...parsed, modified: new Date() }).where(eq(bomScrapItem.id, id));
  return getBomScrapItem(db, id);
}

/**
 * Delete a BOM Scrap Item by ID.
 */
export async function deleteBomScrapItem(db: any, id: string) {
  await db.delete(bomScrapItem).where(eq(bomScrapItem.id, id));
  return { deleted: true, id };
}
