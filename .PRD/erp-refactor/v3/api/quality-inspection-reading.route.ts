// CRUD API handlers for Quality Inspection Reading
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityInspectionReading } from '../db/schema.js';
import { QualityInspectionReadingSchema, QualityInspectionReadingInsertSchema } from '../types/quality-inspection-reading.js';

export const ROUTE_PREFIX = '/quality-inspection-reading';

/**
 * List Quality Inspection Reading records.
 */
export async function listQualityInspectionReading(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityInspectionReading).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Inspection Reading by ID.
 */
export async function getQualityInspectionReading(db: any, id: string) {
  const rows = await db.select().from(qualityInspectionReading).where(eq(qualityInspectionReading.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Inspection Reading.
 */
export async function createQualityInspectionReading(db: any, data: unknown) {
  const parsed = QualityInspectionReadingInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityInspectionReading).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Inspection Reading.
 */
export async function updateQualityInspectionReading(db: any, id: string, data: unknown) {
  const parsed = QualityInspectionReadingInsertSchema.partial().parse(data);
  await db.update(qualityInspectionReading).set({ ...parsed, modified: new Date() }).where(eq(qualityInspectionReading.id, id));
  return getQualityInspectionReading(db, id);
}

/**
 * Delete a Quality Inspection Reading by ID.
 */
export async function deleteQualityInspectionReading(db: any, id: string) {
  await db.delete(qualityInspectionReading).where(eq(qualityInspectionReading.id, id));
  return { deleted: true, id };
}
