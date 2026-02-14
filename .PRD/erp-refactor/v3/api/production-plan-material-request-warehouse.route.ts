// CRUD API handlers for Production Plan Material Request Warehouse
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { productionPlanMaterialRequestWarehouse } from '../db/schema.js';
import { ProductionPlanMaterialRequestWarehouseSchema, ProductionPlanMaterialRequestWarehouseInsertSchema } from '../types/production-plan-material-request-warehouse.js';

export const ROUTE_PREFIX = '/production-plan-material-request-warehouse';

/**
 * List Production Plan Material Request Warehouse records.
 */
export async function listProductionPlanMaterialRequestWarehouse(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(productionPlanMaterialRequestWarehouse).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Production Plan Material Request Warehouse by ID.
 */
export async function getProductionPlanMaterialRequestWarehouse(db: any, id: string) {
  const rows = await db.select().from(productionPlanMaterialRequestWarehouse).where(eq(productionPlanMaterialRequestWarehouse.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Production Plan Material Request Warehouse.
 */
export async function createProductionPlanMaterialRequestWarehouse(db: any, data: unknown) {
  const parsed = ProductionPlanMaterialRequestWarehouseInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(productionPlanMaterialRequestWarehouse).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Production Plan Material Request Warehouse.
 */
export async function updateProductionPlanMaterialRequestWarehouse(db: any, id: string, data: unknown) {
  const parsed = ProductionPlanMaterialRequestWarehouseInsertSchema.partial().parse(data);
  await db.update(productionPlanMaterialRequestWarehouse).set({ ...parsed, modified: new Date() }).where(eq(productionPlanMaterialRequestWarehouse.id, id));
  return getProductionPlanMaterialRequestWarehouse(db, id);
}

/**
 * Delete a Production Plan Material Request Warehouse by ID.
 */
export async function deleteProductionPlanMaterialRequestWarehouse(db: any, id: string) {
  await db.delete(productionPlanMaterialRequestWarehouse).where(eq(productionPlanMaterialRequestWarehouse.id, id));
  return { deleted: true, id };
}
