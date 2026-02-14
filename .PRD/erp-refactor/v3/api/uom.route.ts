// CRUD API handlers for UOM
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { uom } from '../db/schema.js';
import { UomSchema, UomInsertSchema } from '../types/uom.js';

export const ROUTE_PREFIX = '/uom';

/**
 * List UOM records.
 */
export async function listUom(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(uom).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single UOM by ID.
 */
export async function getUom(db: any, id: string) {
  const rows = await db.select().from(uom).where(eq(uom.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new UOM.
 */
export async function createUom(db: any, data: unknown) {
  const parsed = UomInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(uom).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing UOM.
 */
export async function updateUom(db: any, id: string, data: unknown) {
  const parsed = UomInsertSchema.partial().parse(data);
  await db.update(uom).set({ ...parsed, modified: new Date() }).where(eq(uom.id, id));
  return getUom(db, id);
}

/**
 * Delete a UOM by ID.
 */
export async function deleteUom(db: any, id: string) {
  await db.delete(uom).where(eq(uom.id, id));
  return { deleted: true, id };
}
