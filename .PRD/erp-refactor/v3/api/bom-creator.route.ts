// CRUD API handlers for BOM Creator
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomCreator } from '../db/schema.js';
import { BomCreatorSchema, BomCreatorInsertSchema } from '../types/bom-creator.js';

export const ROUTE_PREFIX = '/bom-creator';

/**
 * List BOM Creator records.
 */
export async function listBomCreator(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomCreator).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Creator by ID.
 */
export async function getBomCreator(db: any, id: string) {
  const rows = await db.select().from(bomCreator).where(eq(bomCreator.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Creator.
 */
export async function createBomCreator(db: any, data: unknown) {
  const parsed = BomCreatorInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomCreator).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Creator.
 */
export async function updateBomCreator(db: any, id: string, data: unknown) {
  const parsed = BomCreatorInsertSchema.partial().parse(data);
  await db.update(bomCreator).set({ ...parsed, modified: new Date() }).where(eq(bomCreator.id, id));
  return getBomCreator(db, id);
}

/**
 * Delete a BOM Creator by ID.
 */
export async function deleteBomCreator(db: any, id: string) {
  await db.delete(bomCreator).where(eq(bomCreator.id, id));
  return { deleted: true, id };
}

/**
 * Submit a BOM Creator (set docstatus = 1).
 */
export async function submitBomCreator(db: any, id: string) {
  await db.update(bomCreator).set({ docstatus: 1, modified: new Date() }).where(eq(bomCreator.id, id));
  return getBomCreator(db, id);
}

/**
 * Cancel a BOM Creator (set docstatus = 2).
 */
export async function cancelBomCreator(db: any, id: string) {
  await db.update(bomCreator).set({ docstatus: 2, modified: new Date() }).where(eq(bomCreator.id, id));
  return getBomCreator(db, id);
}
