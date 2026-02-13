// CRUD API handlers for Production Plan
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { productionPlan } from '../db/schema.js';
import { ProductionPlanSchema, ProductionPlanInsertSchema } from '../types/production-plan.js';

export const ROUTE_PREFIX = '/production-plan';

/**
 * List Production Plan records.
 */
export async function listProductionPlan(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(productionPlan).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Production Plan by ID.
 */
export async function getProductionPlan(db: any, id: string) {
  const rows = await db.select().from(productionPlan).where(eq(productionPlan.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Production Plan.
 */
export async function createProductionPlan(db: any, data: unknown) {
  const parsed = ProductionPlanInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(productionPlan).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Production Plan.
 */
export async function updateProductionPlan(db: any, id: string, data: unknown) {
  const parsed = ProductionPlanInsertSchema.partial().parse(data);
  await db.update(productionPlan).set({ ...parsed, modified: new Date() }).where(eq(productionPlan.id, id));
  return getProductionPlan(db, id);
}

/**
 * Delete a Production Plan by ID.
 */
export async function deleteProductionPlan(db: any, id: string) {
  await db.delete(productionPlan).where(eq(productionPlan.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Production Plan (set docstatus = 1).
 */
export async function submitProductionPlan(db: any, id: string) {
  await db.update(productionPlan).set({ docstatus: 1, modified: new Date() }).where(eq(productionPlan.id, id));
  return getProductionPlan(db, id);
}

/**
 * Cancel a Production Plan (set docstatus = 2).
 */
export async function cancelProductionPlan(db: any, id: string) {
  await db.update(productionPlan).set({ docstatus: 2, modified: new Date() }).where(eq(productionPlan.id, id));
  return getProductionPlan(db, id);
}
