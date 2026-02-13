// CRUD API handlers for Quality Inspection Parameter
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityInspectionParameter } from '../db/schema.js';
import { QualityInspectionParameterSchema, QualityInspectionParameterInsertSchema } from '../types/quality-inspection-parameter.js';

export const ROUTE_PREFIX = '/quality-inspection-parameter';

/**
 * List Quality Inspection Parameter records.
 */
export async function listQualityInspectionParameter(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityInspectionParameter).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Inspection Parameter by ID.
 */
export async function getQualityInspectionParameter(db: any, id: string) {
  const rows = await db.select().from(qualityInspectionParameter).where(eq(qualityInspectionParameter.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Inspection Parameter.
 */
export async function createQualityInspectionParameter(db: any, data: unknown) {
  const parsed = QualityInspectionParameterInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityInspectionParameter).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Inspection Parameter.
 */
export async function updateQualityInspectionParameter(db: any, id: string, data: unknown) {
  const parsed = QualityInspectionParameterInsertSchema.partial().parse(data);
  await db.update(qualityInspectionParameter).set({ ...parsed, modified: new Date() }).where(eq(qualityInspectionParameter.id, id));
  return getQualityInspectionParameter(db, id);
}

/**
 * Delete a Quality Inspection Parameter by ID.
 */
export async function deleteQualityInspectionParameter(db: any, id: string) {
  await db.delete(qualityInspectionParameter).where(eq(qualityInspectionParameter.id, id));
  return { deleted: true, id };
}
