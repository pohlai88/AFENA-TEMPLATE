// CRUD API handlers for Quality Feedback Template Parameter
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityFeedbackTemplateParameter } from '../db/schema.js';
import { QualityFeedbackTemplateParameterSchema, QualityFeedbackTemplateParameterInsertSchema } from '../types/quality-feedback-template-parameter.js';

export const ROUTE_PREFIX = '/quality-feedback-template-parameter';

/**
 * List Quality Feedback Template Parameter records.
 */
export async function listQualityFeedbackTemplateParameter(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityFeedbackTemplateParameter).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Feedback Template Parameter by ID.
 */
export async function getQualityFeedbackTemplateParameter(db: any, id: string) {
  const rows = await db.select().from(qualityFeedbackTemplateParameter).where(eq(qualityFeedbackTemplateParameter.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Feedback Template Parameter.
 */
export async function createQualityFeedbackTemplateParameter(db: any, data: unknown) {
  const parsed = QualityFeedbackTemplateParameterInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityFeedbackTemplateParameter).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Feedback Template Parameter.
 */
export async function updateQualityFeedbackTemplateParameter(db: any, id: string, data: unknown) {
  const parsed = QualityFeedbackTemplateParameterInsertSchema.partial().parse(data);
  await db.update(qualityFeedbackTemplateParameter).set({ ...parsed, modified: new Date() }).where(eq(qualityFeedbackTemplateParameter.id, id));
  return getQualityFeedbackTemplateParameter(db, id);
}

/**
 * Delete a Quality Feedback Template Parameter by ID.
 */
export async function deleteQualityFeedbackTemplateParameter(db: any, id: string) {
  await db.delete(qualityFeedbackTemplateParameter).where(eq(qualityFeedbackTemplateParameter.id, id));
  return { deleted: true, id };
}
