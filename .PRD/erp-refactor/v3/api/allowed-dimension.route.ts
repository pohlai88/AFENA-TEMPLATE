// CRUD API handlers for Allowed Dimension
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { allowedDimension } from '../db/schema.js';
import { AllowedDimensionSchema, AllowedDimensionInsertSchema } from '../types/allowed-dimension.js';

export const ROUTE_PREFIX = '/allowed-dimension';

/**
 * List Allowed Dimension records.
 */
export async function listAllowedDimension(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(allowedDimension).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Allowed Dimension by ID.
 */
export async function getAllowedDimension(db: any, id: string) {
  const rows = await db.select().from(allowedDimension).where(eq(allowedDimension.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Allowed Dimension.
 */
export async function createAllowedDimension(db: any, data: unknown) {
  const parsed = AllowedDimensionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(allowedDimension).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Allowed Dimension.
 */
export async function updateAllowedDimension(db: any, id: string, data: unknown) {
  const parsed = AllowedDimensionInsertSchema.partial().parse(data);
  await db.update(allowedDimension).set({ ...parsed, modified: new Date() }).where(eq(allowedDimension.id, id));
  return getAllowedDimension(db, id);
}

/**
 * Delete a Allowed Dimension by ID.
 */
export async function deleteAllowedDimension(db: any, id: string) {
  await db.delete(allowedDimension).where(eq(allowedDimension.id, id));
  return { deleted: true, id };
}
