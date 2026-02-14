// CRUD API handlers for Quality Inspection
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityInspection } from '../db/schema.js';
import { QualityInspectionSchema, QualityInspectionInsertSchema } from '../types/quality-inspection.js';

export const ROUTE_PREFIX = '/quality-inspection';

/**
 * List Quality Inspection records.
 */
export async function listQualityInspection(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityInspection).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Inspection by ID.
 */
export async function getQualityInspection(db: any, id: string) {
  const rows = await db.select().from(qualityInspection).where(eq(qualityInspection.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Inspection.
 */
export async function createQualityInspection(db: any, data: unknown) {
  const parsed = QualityInspectionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityInspection).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Inspection.
 */
export async function updateQualityInspection(db: any, id: string, data: unknown) {
  const parsed = QualityInspectionInsertSchema.partial().parse(data);
  await db.update(qualityInspection).set({ ...parsed, modified: new Date() }).where(eq(qualityInspection.id, id));
  return getQualityInspection(db, id);
}

/**
 * Delete a Quality Inspection by ID.
 */
export async function deleteQualityInspection(db: any, id: string) {
  await db.delete(qualityInspection).where(eq(qualityInspection.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Quality Inspection (set docstatus = 1).
 */
export async function submitQualityInspection(db: any, id: string) {
  await db.update(qualityInspection).set({ docstatus: 1, modified: new Date() }).where(eq(qualityInspection.id, id));
  return getQualityInspection(db, id);
}

/**
 * Cancel a Quality Inspection (set docstatus = 2).
 */
export async function cancelQualityInspection(db: any, id: string) {
  await db.update(qualityInspection).set({ docstatus: 2, modified: new Date() }).where(eq(qualityInspection.id, id));
  return getQualityInspection(db, id);
}
