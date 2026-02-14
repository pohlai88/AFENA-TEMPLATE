// CRUD API handlers for Quality Feedback Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityFeedbackTemplate } from '../db/schema.js';
import { QualityFeedbackTemplateSchema, QualityFeedbackTemplateInsertSchema } from '../types/quality-feedback-template.js';

export const ROUTE_PREFIX = '/quality-feedback-template';

/**
 * List Quality Feedback Template records.
 */
export async function listQualityFeedbackTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityFeedbackTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Feedback Template by ID.
 */
export async function getQualityFeedbackTemplate(db: any, id: string) {
  const rows = await db.select().from(qualityFeedbackTemplate).where(eq(qualityFeedbackTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Feedback Template.
 */
export async function createQualityFeedbackTemplate(db: any, data: unknown) {
  const parsed = QualityFeedbackTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityFeedbackTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Feedback Template.
 */
export async function updateQualityFeedbackTemplate(db: any, id: string, data: unknown) {
  const parsed = QualityFeedbackTemplateInsertSchema.partial().parse(data);
  await db.update(qualityFeedbackTemplate).set({ ...parsed, modified: new Date() }).where(eq(qualityFeedbackTemplate.id, id));
  return getQualityFeedbackTemplate(db, id);
}

/**
 * Delete a Quality Feedback Template by ID.
 */
export async function deleteQualityFeedbackTemplate(db: any, id: string) {
  await db.delete(qualityFeedbackTemplate).where(eq(qualityFeedbackTemplate.id, id));
  return { deleted: true, id };
}
