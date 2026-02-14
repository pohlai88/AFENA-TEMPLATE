// CRUD API handlers for BOM
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bom } from '../db/schema.js';
import { BomSchema, BomInsertSchema } from '../types/bom.js';

export const ROUTE_PREFIX = '/bom';

/**
 * List BOM records.
 */
export async function listBom(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bom).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM by ID.
 */
export async function getBom(db: any, id: string) {
  const rows = await db.select().from(bom).where(eq(bom.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM.
 */
export async function createBom(db: any, data: unknown) {
  const parsed = BomInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bom).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM.
 */
export async function updateBom(db: any, id: string, data: unknown) {
  const parsed = BomInsertSchema.partial().parse(data);
  await db.update(bom).set({ ...parsed, modified: new Date() }).where(eq(bom.id, id));
  return getBom(db, id);
}

/**
 * Delete a BOM by ID.
 */
export async function deleteBom(db: any, id: string) {
  await db.delete(bom).where(eq(bom.id, id));
  return { deleted: true, id };
}

/**
 * Submit a BOM (set docstatus = 1).
 */
export async function submitBom(db: any, id: string) {
  await db.update(bom).set({ docstatus: 1, modified: new Date() }).where(eq(bom.id, id));
  return getBom(db, id);
}

/**
 * Cancel a BOM (set docstatus = 2).
 */
export async function cancelBom(db: any, id: string) {
  await db.update(bom).set({ docstatus: 2, modified: new Date() }).where(eq(bom.id, id));
  return getBom(db, id);
}
