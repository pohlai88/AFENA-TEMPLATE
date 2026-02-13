// CRUD API handlers for Quality Inspection Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityInspectionTemplate } from '../db/schema.js';
import { QualityInspectionTemplateSchema, QualityInspectionTemplateInsertSchema } from '../types/quality-inspection-template.js';

export const ROUTE_PREFIX = '/quality-inspection-template';

/**
 * List Quality Inspection Template records.
 */
export async function listQualityInspectionTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityInspectionTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Inspection Template by ID.
 */
export async function getQualityInspectionTemplate(db: any, id: string) {
  const rows = await db.select().from(qualityInspectionTemplate).where(eq(qualityInspectionTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Inspection Template.
 */
export async function createQualityInspectionTemplate(db: any, data: unknown) {
  const parsed = QualityInspectionTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityInspectionTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Inspection Template.
 */
export async function updateQualityInspectionTemplate(db: any, id: string, data: unknown) {
  const parsed = QualityInspectionTemplateInsertSchema.partial().parse(data);
  await db.update(qualityInspectionTemplate).set({ ...parsed, modified: new Date() }).where(eq(qualityInspectionTemplate.id, id));
  return getQualityInspectionTemplate(db, id);
}

/**
 * Delete a Quality Inspection Template by ID.
 */
export async function deleteQualityInspectionTemplate(db: any, id: string) {
  await db.delete(qualityInspectionTemplate).where(eq(qualityInspectionTemplate.id, id));
  return { deleted: true, id };
}
