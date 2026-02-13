// CRUD API handlers for Quality Review Objective
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityReviewObjective } from '../db/schema.js';
import { QualityReviewObjectiveSchema, QualityReviewObjectiveInsertSchema } from '../types/quality-review-objective.js';

export const ROUTE_PREFIX = '/quality-review-objective';

/**
 * List Quality Review Objective records.
 */
export async function listQualityReviewObjective(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityReviewObjective).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Review Objective by ID.
 */
export async function getQualityReviewObjective(db: any, id: string) {
  const rows = await db.select().from(qualityReviewObjective).where(eq(qualityReviewObjective.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Review Objective.
 */
export async function createQualityReviewObjective(db: any, data: unknown) {
  const parsed = QualityReviewObjectiveInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityReviewObjective).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Review Objective.
 */
export async function updateQualityReviewObjective(db: any, id: string, data: unknown) {
  const parsed = QualityReviewObjectiveInsertSchema.partial().parse(data);
  await db.update(qualityReviewObjective).set({ ...parsed, modified: new Date() }).where(eq(qualityReviewObjective.id, id));
  return getQualityReviewObjective(db, id);
}

/**
 * Delete a Quality Review Objective by ID.
 */
export async function deleteQualityReviewObjective(db: any, id: string) {
  await db.delete(qualityReviewObjective).where(eq(qualityReviewObjective.id, id));
  return { deleted: true, id };
}
