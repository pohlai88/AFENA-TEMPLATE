// CRUD API handlers for Quality Feedback
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityFeedback } from '../db/schema.js';
import { QualityFeedbackSchema, QualityFeedbackInsertSchema } from '../types/quality-feedback.js';

export const ROUTE_PREFIX = '/quality-feedback';

/**
 * List Quality Feedback records.
 */
export async function listQualityFeedback(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityFeedback).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Feedback by ID.
 */
export async function getQualityFeedback(db: any, id: string) {
  const rows = await db.select().from(qualityFeedback).where(eq(qualityFeedback.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Feedback.
 */
export async function createQualityFeedback(db: any, data: unknown) {
  const parsed = QualityFeedbackInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityFeedback).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Feedback.
 */
export async function updateQualityFeedback(db: any, id: string, data: unknown) {
  const parsed = QualityFeedbackInsertSchema.partial().parse(data);
  await db.update(qualityFeedback).set({ ...parsed, modified: new Date() }).where(eq(qualityFeedback.id, id));
  return getQualityFeedback(db, id);
}

/**
 * Delete a Quality Feedback by ID.
 */
export async function deleteQualityFeedback(db: any, id: string) {
  await db.delete(qualityFeedback).where(eq(qualityFeedback.id, id));
  return { deleted: true, id };
}
