// CRUD API handlers for BOM Operation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomOperation } from '../db/schema.js';
import { BomOperationSchema, BomOperationInsertSchema } from '../types/bom-operation.js';

export const ROUTE_PREFIX = '/bom-operation';

/**
 * List BOM Operation records.
 */
export async function listBomOperation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomOperation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Operation by ID.
 */
export async function getBomOperation(db: any, id: string) {
  const rows = await db.select().from(bomOperation).where(eq(bomOperation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Operation.
 */
export async function createBomOperation(db: any, data: unknown) {
  const parsed = BomOperationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomOperation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Operation.
 */
export async function updateBomOperation(db: any, id: string, data: unknown) {
  const parsed = BomOperationInsertSchema.partial().parse(data);
  await db.update(bomOperation).set({ ...parsed, modified: new Date() }).where(eq(bomOperation.id, id));
  return getBomOperation(db, id);
}

/**
 * Delete a BOM Operation by ID.
 */
export async function deleteBomOperation(db: any, id: string) {
  await db.delete(bomOperation).where(eq(bomOperation.id, id));
  return { deleted: true, id };
}
