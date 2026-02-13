// CRUD API handlers for Material Request Plan Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { materialRequestPlanItem } from '../db/schema.js';
import { MaterialRequestPlanItemSchema, MaterialRequestPlanItemInsertSchema } from '../types/material-request-plan-item.js';

export const ROUTE_PREFIX = '/material-request-plan-item';

/**
 * List Material Request Plan Item records.
 */
export async function listMaterialRequestPlanItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(materialRequestPlanItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Material Request Plan Item by ID.
 */
export async function getMaterialRequestPlanItem(db: any, id: string) {
  const rows = await db.select().from(materialRequestPlanItem).where(eq(materialRequestPlanItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Material Request Plan Item.
 */
export async function createMaterialRequestPlanItem(db: any, data: unknown) {
  const parsed = MaterialRequestPlanItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(materialRequestPlanItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Material Request Plan Item.
 */
export async function updateMaterialRequestPlanItem(db: any, id: string, data: unknown) {
  const parsed = MaterialRequestPlanItemInsertSchema.partial().parse(data);
  await db.update(materialRequestPlanItem).set({ ...parsed, modified: new Date() }).where(eq(materialRequestPlanItem.id, id));
  return getMaterialRequestPlanItem(db, id);
}

/**
 * Delete a Material Request Plan Item by ID.
 */
export async function deleteMaterialRequestPlanItem(db: any, id: string) {
  await db.delete(materialRequestPlanItem).where(eq(materialRequestPlanItem.id, id));
  return { deleted: true, id };
}
