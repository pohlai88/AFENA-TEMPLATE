// CRUD API handlers for Cost Center
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { costCenter } from '../db/schema.js';
import { CostCenterSchema, CostCenterInsertSchema } from '../types/cost-center.js';

export const ROUTE_PREFIX = '/cost-center';

/**
 * List Cost Center records.
 */
export async function listCostCenter(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(costCenter).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Cost Center by ID.
 */
export async function getCostCenter(db: any, id: string) {
  const rows = await db.select().from(costCenter).where(eq(costCenter.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Cost Center.
 */
export async function createCostCenter(db: any, data: unknown) {
  const parsed = CostCenterInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(costCenter).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Cost Center.
 */
export async function updateCostCenter(db: any, id: string, data: unknown) {
  const parsed = CostCenterInsertSchema.partial().parse(data);
  await db.update(costCenter).set({ ...parsed, modified: new Date() }).where(eq(costCenter.id, id));
  return getCostCenter(db, id);
}

/**
 * Delete a Cost Center by ID.
 */
export async function deleteCostCenter(db: any, id: string) {
  await db.delete(costCenter).where(eq(costCenter.id, id));
  return { deleted: true, id };
}
