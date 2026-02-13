// CRUD API handlers for Quality Goal
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityGoal } from '../db/schema.js';
import { QualityGoalSchema, QualityGoalInsertSchema } from '../types/quality-goal.js';

export const ROUTE_PREFIX = '/quality-goal';

/**
 * List Quality Goal records.
 */
export async function listQualityGoal(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityGoal).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Goal by ID.
 */
export async function getQualityGoal(db: any, id: string) {
  const rows = await db.select().from(qualityGoal).where(eq(qualityGoal.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Goal.
 */
export async function createQualityGoal(db: any, data: unknown) {
  const parsed = QualityGoalInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityGoal).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Goal.
 */
export async function updateQualityGoal(db: any, id: string, data: unknown) {
  const parsed = QualityGoalInsertSchema.partial().parse(data);
  await db.update(qualityGoal).set({ ...parsed, modified: new Date() }).where(eq(qualityGoal.id, id));
  return getQualityGoal(db, id);
}

/**
 * Delete a Quality Goal by ID.
 */
export async function deleteQualityGoal(db: any, id: string) {
  await db.delete(qualityGoal).where(eq(qualityGoal.id, id));
  return { deleted: true, id };
}
