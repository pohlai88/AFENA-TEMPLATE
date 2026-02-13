// CRUD API handlers for Activity Cost
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { activityCost } from '../db/schema.js';
import { ActivityCostSchema, ActivityCostInsertSchema } from '../types/activity-cost.js';

export const ROUTE_PREFIX = '/activity-cost';

/**
 * List Activity Cost records.
 */
export async function listActivityCost(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(activityCost).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Activity Cost by ID.
 */
export async function getActivityCost(db: any, id: string) {
  const rows = await db.select().from(activityCost).where(eq(activityCost.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Activity Cost.
 */
export async function createActivityCost(db: any, data: unknown) {
  const parsed = ActivityCostInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(activityCost).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Activity Cost.
 */
export async function updateActivityCost(db: any, id: string, data: unknown) {
  const parsed = ActivityCostInsertSchema.partial().parse(data);
  await db.update(activityCost).set({ ...parsed, modified: new Date() }).where(eq(activityCost.id, id));
  return getActivityCost(db, id);
}

/**
 * Delete a Activity Cost by ID.
 */
export async function deleteActivityCost(db: any, id: string) {
  await db.delete(activityCost).where(eq(activityCost.id, id));
  return { deleted: true, id };
}
