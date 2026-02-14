// CRUD API handlers for Quality Goal Objective
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityGoalObjective } from '../db/schema.js';
import { QualityGoalObjectiveSchema, QualityGoalObjectiveInsertSchema } from '../types/quality-goal-objective.js';

export const ROUTE_PREFIX = '/quality-goal-objective';

/**
 * List Quality Goal Objective records.
 */
export async function listQualityGoalObjective(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityGoalObjective).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Goal Objective by ID.
 */
export async function getQualityGoalObjective(db: any, id: string) {
  const rows = await db.select().from(qualityGoalObjective).where(eq(qualityGoalObjective.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Goal Objective.
 */
export async function createQualityGoalObjective(db: any, data: unknown) {
  const parsed = QualityGoalObjectiveInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityGoalObjective).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Goal Objective.
 */
export async function updateQualityGoalObjective(db: any, id: string, data: unknown) {
  const parsed = QualityGoalObjectiveInsertSchema.partial().parse(data);
  await db.update(qualityGoalObjective).set({ ...parsed, modified: new Date() }).where(eq(qualityGoalObjective.id, id));
  return getQualityGoalObjective(db, id);
}

/**
 * Delete a Quality Goal Objective by ID.
 */
export async function deleteQualityGoalObjective(db: any, id: string) {
  await db.delete(qualityGoalObjective).where(eq(qualityGoalObjective.id, id));
  return { deleted: true, id };
}
