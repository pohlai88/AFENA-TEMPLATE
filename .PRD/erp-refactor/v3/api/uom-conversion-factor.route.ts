// CRUD API handlers for UOM Conversion Factor
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { uomConversionFactor } from '../db/schema.js';
import { UomConversionFactorSchema, UomConversionFactorInsertSchema } from '../types/uom-conversion-factor.js';

export const ROUTE_PREFIX = '/uom-conversion-factor';

/**
 * List UOM Conversion Factor records.
 */
export async function listUomConversionFactor(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(uomConversionFactor).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single UOM Conversion Factor by ID.
 */
export async function getUomConversionFactor(db: any, id: string) {
  const rows = await db.select().from(uomConversionFactor).where(eq(uomConversionFactor.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new UOM Conversion Factor.
 */
export async function createUomConversionFactor(db: any, data: unknown) {
  const parsed = UomConversionFactorInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(uomConversionFactor).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing UOM Conversion Factor.
 */
export async function updateUomConversionFactor(db: any, id: string, data: unknown) {
  const parsed = UomConversionFactorInsertSchema.partial().parse(data);
  await db.update(uomConversionFactor).set({ ...parsed, modified: new Date() }).where(eq(uomConversionFactor.id, id));
  return getUomConversionFactor(db, id);
}

/**
 * Delete a UOM Conversion Factor by ID.
 */
export async function deleteUomConversionFactor(db: any, id: string) {
  await db.delete(uomConversionFactor).where(eq(uomConversionFactor.id, id));
  return { deleted: true, id };
}
