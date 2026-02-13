// CRUD API handlers for Production Plan Item Reference
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { productionPlanItemReference } from '../db/schema.js';
import { ProductionPlanItemReferenceSchema, ProductionPlanItemReferenceInsertSchema } from '../types/production-plan-item-reference.js';

export const ROUTE_PREFIX = '/production-plan-item-reference';

/**
 * List Production Plan Item Reference records.
 */
export async function listProductionPlanItemReference(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(productionPlanItemReference).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Production Plan Item Reference by ID.
 */
export async function getProductionPlanItemReference(db: any, id: string) {
  const rows = await db.select().from(productionPlanItemReference).where(eq(productionPlanItemReference.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Production Plan Item Reference.
 */
export async function createProductionPlanItemReference(db: any, data: unknown) {
  const parsed = ProductionPlanItemReferenceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(productionPlanItemReference).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Production Plan Item Reference.
 */
export async function updateProductionPlanItemReference(db: any, id: string, data: unknown) {
  const parsed = ProductionPlanItemReferenceInsertSchema.partial().parse(data);
  await db.update(productionPlanItemReference).set({ ...parsed, modified: new Date() }).where(eq(productionPlanItemReference.id, id));
  return getProductionPlanItemReference(db, id);
}

/**
 * Delete a Production Plan Item Reference by ID.
 */
export async function deleteProductionPlanItemReference(db: any, id: string) {
  await db.delete(productionPlanItemReference).where(eq(productionPlanItemReference.id, id));
  return { deleted: true, id };
}
