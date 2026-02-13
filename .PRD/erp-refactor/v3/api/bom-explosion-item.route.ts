// CRUD API handlers for BOM Explosion Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomExplosionItem } from '../db/schema.js';
import { BomExplosionItemSchema, BomExplosionItemInsertSchema } from '../types/bom-explosion-item.js';

export const ROUTE_PREFIX = '/bom-explosion-item';

/**
 * List BOM Explosion Item records.
 */
export async function listBomExplosionItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomExplosionItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Explosion Item by ID.
 */
export async function getBomExplosionItem(db: any, id: string) {
  const rows = await db.select().from(bomExplosionItem).where(eq(bomExplosionItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Explosion Item.
 */
export async function createBomExplosionItem(db: any, data: unknown) {
  const parsed = BomExplosionItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomExplosionItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Explosion Item.
 */
export async function updateBomExplosionItem(db: any, id: string, data: unknown) {
  const parsed = BomExplosionItemInsertSchema.partial().parse(data);
  await db.update(bomExplosionItem).set({ ...parsed, modified: new Date() }).where(eq(bomExplosionItem.id, id));
  return getBomExplosionItem(db, id);
}

/**
 * Delete a BOM Explosion Item by ID.
 */
export async function deleteBomExplosionItem(db: any, id: string) {
  await db.delete(bomExplosionItem).where(eq(bomExplosionItem.id, id));
  return { deleted: true, id };
}
