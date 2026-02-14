// CRUD API handlers for Quality Procedure
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityProcedure } from '../db/schema.js';
import { QualityProcedureSchema, QualityProcedureInsertSchema } from '../types/quality-procedure.js';

export const ROUTE_PREFIX = '/quality-procedure';

/**
 * List Quality Procedure records.
 */
export async function listQualityProcedure(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityProcedure).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Procedure by ID.
 */
export async function getQualityProcedure(db: any, id: string) {
  const rows = await db.select().from(qualityProcedure).where(eq(qualityProcedure.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Procedure.
 */
export async function createQualityProcedure(db: any, data: unknown) {
  const parsed = QualityProcedureInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityProcedure).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Procedure.
 */
export async function updateQualityProcedure(db: any, id: string, data: unknown) {
  const parsed = QualityProcedureInsertSchema.partial().parse(data);
  await db.update(qualityProcedure).set({ ...parsed, modified: new Date() }).where(eq(qualityProcedure.id, id));
  return getQualityProcedure(db, id);
}

/**
 * Delete a Quality Procedure by ID.
 */
export async function deleteQualityProcedure(db: any, id: string) {
  await db.delete(qualityProcedure).where(eq(qualityProcedure.id, id));
  return { deleted: true, id };
}
