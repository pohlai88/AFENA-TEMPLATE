// CRUD API handlers for BOM Update Log
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomUpdateLog } from '../db/schema.js';
import { BomUpdateLogSchema, BomUpdateLogInsertSchema } from '../types/bom-update-log.js';

export const ROUTE_PREFIX = '/bom-update-log';

/**
 * List BOM Update Log records.
 */
export async function listBomUpdateLog(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomUpdateLog).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Update Log by ID.
 */
export async function getBomUpdateLog(db: any, id: string) {
  const rows = await db.select().from(bomUpdateLog).where(eq(bomUpdateLog.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Update Log.
 */
export async function createBomUpdateLog(db: any, data: unknown) {
  const parsed = BomUpdateLogInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomUpdateLog).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Update Log.
 */
export async function updateBomUpdateLog(db: any, id: string, data: unknown) {
  const parsed = BomUpdateLogInsertSchema.partial().parse(data);
  await db.update(bomUpdateLog).set({ ...parsed, modified: new Date() }).where(eq(bomUpdateLog.id, id));
  return getBomUpdateLog(db, id);
}

/**
 * Delete a BOM Update Log by ID.
 */
export async function deleteBomUpdateLog(db: any, id: string) {
  await db.delete(bomUpdateLog).where(eq(bomUpdateLog.id, id));
  return { deleted: true, id };
}

/**
 * Submit a BOM Update Log (set docstatus = 1).
 */
export async function submitBomUpdateLog(db: any, id: string) {
  await db.update(bomUpdateLog).set({ docstatus: 1, modified: new Date() }).where(eq(bomUpdateLog.id, id));
  return getBomUpdateLog(db, id);
}

/**
 * Cancel a BOM Update Log (set docstatus = 2).
 */
export async function cancelBomUpdateLog(db: any, id: string) {
  await db.update(bomUpdateLog).set({ docstatus: 2, modified: new Date() }).where(eq(bomUpdateLog.id, id));
  return getBomUpdateLog(db, id);
}
