// CRUD API handlers for Activity Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { activityType } from '../db/schema.js';
import { ActivityTypeSchema, ActivityTypeInsertSchema } from '../types/activity-type.js';

export const ROUTE_PREFIX = '/activity-type';

/**
 * List Activity Type records.
 */
export async function listActivityType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(activityType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Activity Type by ID.
 */
export async function getActivityType(db: any, id: string) {
  const rows = await db.select().from(activityType).where(eq(activityType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Activity Type.
 */
export async function createActivityType(db: any, data: unknown) {
  const parsed = ActivityTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(activityType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Activity Type.
 */
export async function updateActivityType(db: any, id: string, data: unknown) {
  const parsed = ActivityTypeInsertSchema.partial().parse(data);
  await db.update(activityType).set({ ...parsed, modified: new Date() }).where(eq(activityType.id, id));
  return getActivityType(db, id);
}

/**
 * Delete a Activity Type by ID.
 */
export async function deleteActivityType(db: any, id: string) {
  await db.delete(activityType).where(eq(activityType.id, id));
  return { deleted: true, id };
}
