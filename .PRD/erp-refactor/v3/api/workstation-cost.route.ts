// CRUD API handlers for Workstation Cost
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { workstationCost } from '../db/schema.js';
import { WorkstationCostSchema, WorkstationCostInsertSchema } from '../types/workstation-cost.js';

export const ROUTE_PREFIX = '/workstation-cost';

/**
 * List Workstation Cost records.
 */
export async function listWorkstationCost(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(workstationCost).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Workstation Cost by ID.
 */
export async function getWorkstationCost(db: any, id: string) {
  const rows = await db.select().from(workstationCost).where(eq(workstationCost.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Workstation Cost.
 */
export async function createWorkstationCost(db: any, data: unknown) {
  const parsed = WorkstationCostInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(workstationCost).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Workstation Cost.
 */
export async function updateWorkstationCost(db: any, id: string, data: unknown) {
  const parsed = WorkstationCostInsertSchema.partial().parse(data);
  await db.update(workstationCost).set({ ...parsed, modified: new Date() }).where(eq(workstationCost.id, id));
  return getWorkstationCost(db, id);
}

/**
 * Delete a Workstation Cost by ID.
 */
export async function deleteWorkstationCost(db: any, id: string) {
  await db.delete(workstationCost).where(eq(workstationCost.id, id));
  return { deleted: true, id };
}
