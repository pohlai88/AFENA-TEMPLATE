// CRUD API handlers for UOM Conversion Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { uomConversionDetail } from '../db/schema.js';
import { UomConversionDetailSchema, UomConversionDetailInsertSchema } from '../types/uom-conversion-detail.js';

export const ROUTE_PREFIX = '/uom-conversion-detail';

/**
 * List UOM Conversion Detail records.
 */
export async function listUomConversionDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(uomConversionDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single UOM Conversion Detail by ID.
 */
export async function getUomConversionDetail(db: any, id: string) {
  const rows = await db.select().from(uomConversionDetail).where(eq(uomConversionDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new UOM Conversion Detail.
 */
export async function createUomConversionDetail(db: any, data: unknown) {
  const parsed = UomConversionDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(uomConversionDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing UOM Conversion Detail.
 */
export async function updateUomConversionDetail(db: any, id: string, data: unknown) {
  const parsed = UomConversionDetailInsertSchema.partial().parse(data);
  await db.update(uomConversionDetail).set({ ...parsed, modified: new Date() }).where(eq(uomConversionDetail.id, id));
  return getUomConversionDetail(db, id);
}

/**
 * Delete a UOM Conversion Detail by ID.
 */
export async function deleteUomConversionDetail(db: any, id: string) {
  await db.delete(uomConversionDetail).where(eq(uomConversionDetail.id, id));
  return { deleted: true, id };
}
