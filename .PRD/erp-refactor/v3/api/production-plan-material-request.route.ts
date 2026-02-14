// CRUD API handlers for Production Plan Material Request
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { productionPlanMaterialRequest } from '../db/schema.js';
import { ProductionPlanMaterialRequestSchema, ProductionPlanMaterialRequestInsertSchema } from '../types/production-plan-material-request.js';

export const ROUTE_PREFIX = '/production-plan-material-request';

/**
 * List Production Plan Material Request records.
 */
export async function listProductionPlanMaterialRequest(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(productionPlanMaterialRequest).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Production Plan Material Request by ID.
 */
export async function getProductionPlanMaterialRequest(db: any, id: string) {
  const rows = await db.select().from(productionPlanMaterialRequest).where(eq(productionPlanMaterialRequest.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Production Plan Material Request.
 */
export async function createProductionPlanMaterialRequest(db: any, data: unknown) {
  const parsed = ProductionPlanMaterialRequestInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(productionPlanMaterialRequest).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Production Plan Material Request.
 */
export async function updateProductionPlanMaterialRequest(db: any, id: string, data: unknown) {
  const parsed = ProductionPlanMaterialRequestInsertSchema.partial().parse(data);
  await db.update(productionPlanMaterialRequest).set({ ...parsed, modified: new Date() }).where(eq(productionPlanMaterialRequest.id, id));
  return getProductionPlanMaterialRequest(db, id);
}

/**
 * Delete a Production Plan Material Request by ID.
 */
export async function deleteProductionPlanMaterialRequest(db: any, id: string) {
  await db.delete(productionPlanMaterialRequest).where(eq(productionPlanMaterialRequest.id, id));
  return { deleted: true, id };
}
