// CRUD API handlers for Quality Review
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityReview } from '../db/schema.js';
import { QualityReviewSchema, QualityReviewInsertSchema } from '../types/quality-review.js';

export const ROUTE_PREFIX = '/quality-review';

/**
 * List Quality Review records.
 */
export async function listQualityReview(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityReview).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Review by ID.
 */
export async function getQualityReview(db: any, id: string) {
  const rows = await db.select().from(qualityReview).where(eq(qualityReview.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Review.
 */
export async function createQualityReview(db: any, data: unknown) {
  const parsed = QualityReviewInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityReview).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Review.
 */
export async function updateQualityReview(db: any, id: string, data: unknown) {
  const parsed = QualityReviewInsertSchema.partial().parse(data);
  await db.update(qualityReview).set({ ...parsed, modified: new Date() }).where(eq(qualityReview.id, id));
  return getQualityReview(db, id);
}

/**
 * Delete a Quality Review by ID.
 */
export async function deleteQualityReview(db: any, id: string) {
  await db.delete(qualityReview).where(eq(qualityReview.id, id));
  return { deleted: true, id };
}
