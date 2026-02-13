// CRUD API handlers for BOM Website Operation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomWebsiteOperation } from '../db/schema.js';
import { BomWebsiteOperationSchema, BomWebsiteOperationInsertSchema } from '../types/bom-website-operation.js';

export const ROUTE_PREFIX = '/bom-website-operation';

/**
 * List BOM Website Operation records.
 */
export async function listBomWebsiteOperation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomWebsiteOperation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Website Operation by ID.
 */
export async function getBomWebsiteOperation(db: any, id: string) {
  const rows = await db.select().from(bomWebsiteOperation).where(eq(bomWebsiteOperation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Website Operation.
 */
export async function createBomWebsiteOperation(db: any, data: unknown) {
  const parsed = BomWebsiteOperationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomWebsiteOperation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Website Operation.
 */
export async function updateBomWebsiteOperation(db: any, id: string, data: unknown) {
  const parsed = BomWebsiteOperationInsertSchema.partial().parse(data);
  await db.update(bomWebsiteOperation).set({ ...parsed, modified: new Date() }).where(eq(bomWebsiteOperation.id, id));
  return getBomWebsiteOperation(db, id);
}

/**
 * Delete a BOM Website Operation by ID.
 */
export async function deleteBomWebsiteOperation(db: any, id: string) {
  await db.delete(bomWebsiteOperation).where(eq(bomWebsiteOperation.id, id));
  return { deleted: true, id };
}
