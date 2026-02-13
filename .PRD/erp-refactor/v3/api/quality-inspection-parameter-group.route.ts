// CRUD API handlers for Quality Inspection Parameter Group
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityInspectionParameterGroup } from '../db/schema.js';
import { QualityInspectionParameterGroupSchema, QualityInspectionParameterGroupInsertSchema } from '../types/quality-inspection-parameter-group.js';

export const ROUTE_PREFIX = '/quality-inspection-parameter-group';

/**
 * List Quality Inspection Parameter Group records.
 */
export async function listQualityInspectionParameterGroup(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityInspectionParameterGroup).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Inspection Parameter Group by ID.
 */
export async function getQualityInspectionParameterGroup(db: any, id: string) {
  const rows = await db.select().from(qualityInspectionParameterGroup).where(eq(qualityInspectionParameterGroup.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Inspection Parameter Group.
 */
export async function createQualityInspectionParameterGroup(db: any, data: unknown) {
  const parsed = QualityInspectionParameterGroupInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityInspectionParameterGroup).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Inspection Parameter Group.
 */
export async function updateQualityInspectionParameterGroup(db: any, id: string, data: unknown) {
  const parsed = QualityInspectionParameterGroupInsertSchema.partial().parse(data);
  await db.update(qualityInspectionParameterGroup).set({ ...parsed, modified: new Date() }).where(eq(qualityInspectionParameterGroup.id, id));
  return getQualityInspectionParameterGroup(db, id);
}

/**
 * Delete a Quality Inspection Parameter Group by ID.
 */
export async function deleteQualityInspectionParameterGroup(db: any, id: string) {
  await db.delete(qualityInspectionParameterGroup).where(eq(qualityInspectionParameterGroup.id, id));
  return { deleted: true, id };
}
