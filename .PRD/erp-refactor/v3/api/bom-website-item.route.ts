// CRUD API handlers for BOM Website Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomWebsiteItem } from '../db/schema.js';
import { BomWebsiteItemSchema, BomWebsiteItemInsertSchema } from '../types/bom-website-item.js';

export const ROUTE_PREFIX = '/bom-website-item';

/**
 * List BOM Website Item records.
 */
export async function listBomWebsiteItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomWebsiteItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Website Item by ID.
 */
export async function getBomWebsiteItem(db: any, id: string) {
  const rows = await db.select().from(bomWebsiteItem).where(eq(bomWebsiteItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Website Item.
 */
export async function createBomWebsiteItem(db: any, data: unknown) {
  const parsed = BomWebsiteItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomWebsiteItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Website Item.
 */
export async function updateBomWebsiteItem(db: any, id: string, data: unknown) {
  const parsed = BomWebsiteItemInsertSchema.partial().parse(data);
  await db.update(bomWebsiteItem).set({ ...parsed, modified: new Date() }).where(eq(bomWebsiteItem.id, id));
  return getBomWebsiteItem(db, id);
}

/**
 * Delete a BOM Website Item by ID.
 */
export async function deleteBomWebsiteItem(db: any, id: string) {
  await db.delete(bomWebsiteItem).where(eq(bomWebsiteItem.id, id));
  return { deleted: true, id };
}
