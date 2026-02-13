// CRUD API handlers for Production Plan Sub Assembly Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { productionPlanSubAssemblyItem } from '../db/schema.js';
import { ProductionPlanSubAssemblyItemSchema, ProductionPlanSubAssemblyItemInsertSchema } from '../types/production-plan-sub-assembly-item.js';

export const ROUTE_PREFIX = '/production-plan-sub-assembly-item';

/**
 * List Production Plan Sub Assembly Item records.
 */
export async function listProductionPlanSubAssemblyItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(productionPlanSubAssemblyItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Production Plan Sub Assembly Item by ID.
 */
export async function getProductionPlanSubAssemblyItem(db: any, id: string) {
  const rows = await db.select().from(productionPlanSubAssemblyItem).where(eq(productionPlanSubAssemblyItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Production Plan Sub Assembly Item.
 */
export async function createProductionPlanSubAssemblyItem(db: any, data: unknown) {
  const parsed = ProductionPlanSubAssemblyItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(productionPlanSubAssemblyItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Production Plan Sub Assembly Item.
 */
export async function updateProductionPlanSubAssemblyItem(db: any, id: string, data: unknown) {
  const parsed = ProductionPlanSubAssemblyItemInsertSchema.partial().parse(data);
  await db.update(productionPlanSubAssemblyItem).set({ ...parsed, modified: new Date() }).where(eq(productionPlanSubAssemblyItem.id, id));
  return getProductionPlanSubAssemblyItem(db, id);
}

/**
 * Delete a Production Plan Sub Assembly Item by ID.
 */
export async function deleteProductionPlanSubAssemblyItem(db: any, id: string) {
  await db.delete(productionPlanSubAssemblyItem).where(eq(productionPlanSubAssemblyItem.id, id));
  return { deleted: true, id };
}
