// CRUD API handlers for Quality Feedback Parameter
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityFeedbackParameter } from '../db/schema.js';
import { QualityFeedbackParameterSchema, QualityFeedbackParameterInsertSchema } from '../types/quality-feedback-parameter.js';

export const ROUTE_PREFIX = '/quality-feedback-parameter';

/**
 * List Quality Feedback Parameter records.
 */
export async function listQualityFeedbackParameter(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityFeedbackParameter).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Feedback Parameter by ID.
 */
export async function getQualityFeedbackParameter(db: any, id: string) {
  const rows = await db.select().from(qualityFeedbackParameter).where(eq(qualityFeedbackParameter.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Feedback Parameter.
 */
export async function createQualityFeedbackParameter(db: any, data: unknown) {
  const parsed = QualityFeedbackParameterInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityFeedbackParameter).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Feedback Parameter.
 */
export async function updateQualityFeedbackParameter(db: any, id: string, data: unknown) {
  const parsed = QualityFeedbackParameterInsertSchema.partial().parse(data);
  await db.update(qualityFeedbackParameter).set({ ...parsed, modified: new Date() }).where(eq(qualityFeedbackParameter.id, id));
  return getQualityFeedbackParameter(db, id);
}

/**
 * Delete a Quality Feedback Parameter by ID.
 */
export async function deleteQualityFeedbackParameter(db: any, id: string) {
  await db.delete(qualityFeedbackParameter).where(eq(qualityFeedbackParameter.id, id));
  return { deleted: true, id };
}
