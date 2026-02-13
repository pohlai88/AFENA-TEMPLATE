// CRUD API handlers for Cost Center Allocation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { costCenterAllocation } from '../db/schema.js';
import { CostCenterAllocationSchema, CostCenterAllocationInsertSchema } from '../types/cost-center-allocation.js';

export const ROUTE_PREFIX = '/cost-center-allocation';

/**
 * List Cost Center Allocation records.
 */
export async function listCostCenterAllocation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(costCenterAllocation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Cost Center Allocation by ID.
 */
export async function getCostCenterAllocation(db: any, id: string) {
  const rows = await db.select().from(costCenterAllocation).where(eq(costCenterAllocation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Cost Center Allocation.
 */
export async function createCostCenterAllocation(db: any, data: unknown) {
  const parsed = CostCenterAllocationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(costCenterAllocation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Cost Center Allocation.
 */
export async function updateCostCenterAllocation(db: any, id: string, data: unknown) {
  const parsed = CostCenterAllocationInsertSchema.partial().parse(data);
  await db.update(costCenterAllocation).set({ ...parsed, modified: new Date() }).where(eq(costCenterAllocation.id, id));
  return getCostCenterAllocation(db, id);
}

/**
 * Delete a Cost Center Allocation by ID.
 */
export async function deleteCostCenterAllocation(db: any, id: string) {
  await db.delete(costCenterAllocation).where(eq(costCenterAllocation.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Cost Center Allocation (set docstatus = 1).
 */
export async function submitCostCenterAllocation(db: any, id: string) {
  await db.update(costCenterAllocation).set({ docstatus: 1, modified: new Date() }).where(eq(costCenterAllocation.id, id));
  return getCostCenterAllocation(db, id);
}

/**
 * Cancel a Cost Center Allocation (set docstatus = 2).
 */
export async function cancelCostCenterAllocation(db: any, id: string) {
  await db.update(costCenterAllocation).set({ docstatus: 2, modified: new Date() }).where(eq(costCenterAllocation.id, id));
  return getCostCenterAllocation(db, id);
}
