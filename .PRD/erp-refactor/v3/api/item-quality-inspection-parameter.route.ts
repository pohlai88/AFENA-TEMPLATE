// CRUD API handlers for Item Quality Inspection Parameter
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemQualityInspectionParameter } from '../db/schema.js';
import { ItemQualityInspectionParameterSchema, ItemQualityInspectionParameterInsertSchema } from '../types/item-quality-inspection-parameter.js';

export const ROUTE_PREFIX = '/item-quality-inspection-parameter';

/**
 * List Item Quality Inspection Parameter records.
 */
export async function listItemQualityInspectionParameter(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemQualityInspectionParameter).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Quality Inspection Parameter by ID.
 */
export async function getItemQualityInspectionParameter(db: any, id: string) {
  const rows = await db.select().from(itemQualityInspectionParameter).where(eq(itemQualityInspectionParameter.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Quality Inspection Parameter.
 */
export async function createItemQualityInspectionParameter(db: any, data: unknown) {
  const parsed = ItemQualityInspectionParameterInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemQualityInspectionParameter).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Quality Inspection Parameter.
 */
export async function updateItemQualityInspectionParameter(db: any, id: string, data: unknown) {
  const parsed = ItemQualityInspectionParameterInsertSchema.partial().parse(data);
  await db.update(itemQualityInspectionParameter).set({ ...parsed, modified: new Date() }).where(eq(itemQualityInspectionParameter.id, id));
  return getItemQualityInspectionParameter(db, id);
}

/**
 * Delete a Item Quality Inspection Parameter by ID.
 */
export async function deleteItemQualityInspectionParameter(db: any, id: string) {
  await db.delete(itemQualityInspectionParameter).where(eq(itemQualityInspectionParameter.id, id));
  return { deleted: true, id };
}
