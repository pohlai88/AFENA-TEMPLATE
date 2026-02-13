// CRUD API handlers for Cost Center Allocation Percentage
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { costCenterAllocationPercentage } from '../db/schema.js';
import { CostCenterAllocationPercentageSchema, CostCenterAllocationPercentageInsertSchema } from '../types/cost-center-allocation-percentage.js';

export const ROUTE_PREFIX = '/cost-center-allocation-percentage';

/**
 * List Cost Center Allocation Percentage records.
 */
export async function listCostCenterAllocationPercentage(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(costCenterAllocationPercentage).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Cost Center Allocation Percentage by ID.
 */
export async function getCostCenterAllocationPercentage(db: any, id: string) {
  const rows = await db.select().from(costCenterAllocationPercentage).where(eq(costCenterAllocationPercentage.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Cost Center Allocation Percentage.
 */
export async function createCostCenterAllocationPercentage(db: any, data: unknown) {
  const parsed = CostCenterAllocationPercentageInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(costCenterAllocationPercentage).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Cost Center Allocation Percentage.
 */
export async function updateCostCenterAllocationPercentage(db: any, id: string, data: unknown) {
  const parsed = CostCenterAllocationPercentageInsertSchema.partial().parse(data);
  await db.update(costCenterAllocationPercentage).set({ ...parsed, modified: new Date() }).where(eq(costCenterAllocationPercentage.id, id));
  return getCostCenterAllocationPercentage(db, id);
}

/**
 * Delete a Cost Center Allocation Percentage by ID.
 */
export async function deleteCostCenterAllocationPercentage(db: any, id: string) {
  await db.delete(costCenterAllocationPercentage).where(eq(costCenterAllocationPercentage.id, id));
  return { deleted: true, id };
}
