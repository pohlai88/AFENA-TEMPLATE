// CRUD API handlers for Quality Procedure Process
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityProcedureProcess } from '../db/schema.js';
import { QualityProcedureProcessSchema, QualityProcedureProcessInsertSchema } from '../types/quality-procedure-process.js';

export const ROUTE_PREFIX = '/quality-procedure-process';

/**
 * List Quality Procedure Process records.
 */
export async function listQualityProcedureProcess(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityProcedureProcess).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Procedure Process by ID.
 */
export async function getQualityProcedureProcess(db: any, id: string) {
  const rows = await db.select().from(qualityProcedureProcess).where(eq(qualityProcedureProcess.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Procedure Process.
 */
export async function createQualityProcedureProcess(db: any, data: unknown) {
  const parsed = QualityProcedureProcessInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityProcedureProcess).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Procedure Process.
 */
export async function updateQualityProcedureProcess(db: any, id: string, data: unknown) {
  const parsed = QualityProcedureProcessInsertSchema.partial().parse(data);
  await db.update(qualityProcedureProcess).set({ ...parsed, modified: new Date() }).where(eq(qualityProcedureProcess.id, id));
  return getQualityProcedureProcess(db, id);
}

/**
 * Delete a Quality Procedure Process by ID.
 */
export async function deleteQualityProcedureProcess(db: any, id: string) {
  await db.delete(qualityProcedureProcess).where(eq(qualityProcedureProcess.id, id));
  return { deleted: true, id };
}
