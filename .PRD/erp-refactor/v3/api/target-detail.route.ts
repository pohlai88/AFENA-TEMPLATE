// CRUD API handlers for Target Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { targetDetail } from '../db/schema.js';
import { TargetDetailSchema, TargetDetailInsertSchema } from '../types/target-detail.js';

export const ROUTE_PREFIX = '/target-detail';

/**
 * List Target Detail records.
 */
export async function listTargetDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(targetDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Target Detail by ID.
 */
export async function getTargetDetail(db: any, id: string) {
  const rows = await db.select().from(targetDetail).where(eq(targetDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Target Detail.
 */
export async function createTargetDetail(db: any, data: unknown) {
  const parsed = TargetDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(targetDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Target Detail.
 */
export async function updateTargetDetail(db: any, id: string, data: unknown) {
  const parsed = TargetDetailInsertSchema.partial().parse(data);
  await db.update(targetDetail).set({ ...parsed, modified: new Date() }).where(eq(targetDetail.id, id));
  return getTargetDetail(db, id);
}

/**
 * Delete a Target Detail by ID.
 */
export async function deleteTargetDetail(db: any, id: string) {
  await db.delete(targetDetail).where(eq(targetDetail.id, id));
  return { deleted: true, id };
}
