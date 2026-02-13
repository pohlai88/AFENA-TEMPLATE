// CRUD API handlers for BOM Update Batch
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomUpdateBatch } from '../db/schema.js';
import { BomUpdateBatchSchema, BomUpdateBatchInsertSchema } from '../types/bom-update-batch.js';

export const ROUTE_PREFIX = '/bom-update-batch';

/**
 * List BOM Update Batch records.
 */
export async function listBomUpdateBatch(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomUpdateBatch).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Update Batch by ID.
 */
export async function getBomUpdateBatch(db: any, id: string) {
  const rows = await db.select().from(bomUpdateBatch).where(eq(bomUpdateBatch.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Update Batch.
 */
export async function createBomUpdateBatch(db: any, data: unknown) {
  const parsed = BomUpdateBatchInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomUpdateBatch).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Update Batch.
 */
export async function updateBomUpdateBatch(db: any, id: string, data: unknown) {
  const parsed = BomUpdateBatchInsertSchema.partial().parse(data);
  await db.update(bomUpdateBatch).set({ ...parsed, modified: new Date() }).where(eq(bomUpdateBatch.id, id));
  return getBomUpdateBatch(db, id);
}

/**
 * Delete a BOM Update Batch by ID.
 */
export async function deleteBomUpdateBatch(db: any, id: string) {
  await db.delete(bomUpdateBatch).where(eq(bomUpdateBatch.id, id));
  return { deleted: true, id };
}
