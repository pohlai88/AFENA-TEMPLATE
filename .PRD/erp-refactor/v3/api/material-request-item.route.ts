// CRUD API handlers for Material Request Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { materialRequestItem } from '../db/schema.js';
import { MaterialRequestItemSchema, MaterialRequestItemInsertSchema } from '../types/material-request-item.js';

export const ROUTE_PREFIX = '/material-request-item';

/**
 * List Material Request Item records.
 */
export async function listMaterialRequestItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(materialRequestItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Material Request Item by ID.
 */
export async function getMaterialRequestItem(db: any, id: string) {
  const rows = await db.select().from(materialRequestItem).where(eq(materialRequestItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Material Request Item.
 */
export async function createMaterialRequestItem(db: any, data: unknown) {
  const parsed = MaterialRequestItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(materialRequestItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Material Request Item.
 */
export async function updateMaterialRequestItem(db: any, id: string, data: unknown) {
  const parsed = MaterialRequestItemInsertSchema.partial().parse(data);
  await db.update(materialRequestItem).set({ ...parsed, modified: new Date() }).where(eq(materialRequestItem.id, id));
  return getMaterialRequestItem(db, id);
}

/**
 * Delete a Material Request Item by ID.
 */
export async function deleteMaterialRequestItem(db: any, id: string) {
  await db.delete(materialRequestItem).where(eq(materialRequestItem.id, id));
  return { deleted: true, id };
}
