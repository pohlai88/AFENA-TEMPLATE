// CRUD API handlers for Production Plan Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { productionPlanItem } from '../db/schema.js';
import { ProductionPlanItemSchema, ProductionPlanItemInsertSchema } from '../types/production-plan-item.js';

export const ROUTE_PREFIX = '/production-plan-item';

/**
 * List Production Plan Item records.
 */
export async function listProductionPlanItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(productionPlanItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Production Plan Item by ID.
 */
export async function getProductionPlanItem(db: any, id: string) {
  const rows = await db.select().from(productionPlanItem).where(eq(productionPlanItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Production Plan Item.
 */
export async function createProductionPlanItem(db: any, data: unknown) {
  const parsed = ProductionPlanItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(productionPlanItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Production Plan Item.
 */
export async function updateProductionPlanItem(db: any, id: string, data: unknown) {
  const parsed = ProductionPlanItemInsertSchema.partial().parse(data);
  await db.update(productionPlanItem).set({ ...parsed, modified: new Date() }).where(eq(productionPlanItem.id, id));
  return getProductionPlanItem(db, id);
}

/**
 * Delete a Production Plan Item by ID.
 */
export async function deleteProductionPlanItem(db: any, id: string) {
  await db.delete(productionPlanItem).where(eq(productionPlanItem.id, id));
  return { deleted: true, id };
}
