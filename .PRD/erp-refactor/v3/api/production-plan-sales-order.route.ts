// CRUD API handlers for Production Plan Sales Order
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { productionPlanSalesOrder } from '../db/schema.js';
import { ProductionPlanSalesOrderSchema, ProductionPlanSalesOrderInsertSchema } from '../types/production-plan-sales-order.js';

export const ROUTE_PREFIX = '/production-plan-sales-order';

/**
 * List Production Plan Sales Order records.
 */
export async function listProductionPlanSalesOrder(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(productionPlanSalesOrder).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Production Plan Sales Order by ID.
 */
export async function getProductionPlanSalesOrder(db: any, id: string) {
  const rows = await db.select().from(productionPlanSalesOrder).where(eq(productionPlanSalesOrder.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Production Plan Sales Order.
 */
export async function createProductionPlanSalesOrder(db: any, data: unknown) {
  const parsed = ProductionPlanSalesOrderInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(productionPlanSalesOrder).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Production Plan Sales Order.
 */
export async function updateProductionPlanSalesOrder(db: any, id: string, data: unknown) {
  const parsed = ProductionPlanSalesOrderInsertSchema.partial().parse(data);
  await db.update(productionPlanSalesOrder).set({ ...parsed, modified: new Date() }).where(eq(productionPlanSalesOrder.id, id));
  return getProductionPlanSalesOrder(db, id);
}

/**
 * Delete a Production Plan Sales Order by ID.
 */
export async function deleteProductionPlanSalesOrder(db: any, id: string) {
  await db.delete(productionPlanSalesOrder).where(eq(productionPlanSalesOrder.id, id));
  return { deleted: true, id };
}
