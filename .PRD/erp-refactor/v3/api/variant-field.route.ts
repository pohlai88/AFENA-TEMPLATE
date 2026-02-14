// CRUD API handlers for Variant Field
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { variantField } from '../db/schema.js';
import { VariantFieldSchema, VariantFieldInsertSchema } from '../types/variant-field.js';

export const ROUTE_PREFIX = '/variant-field';

/**
 * List Variant Field records.
 */
export async function listVariantField(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(variantField).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Variant Field by ID.
 */
export async function getVariantField(db: any, id: string) {
  const rows = await db.select().from(variantField).where(eq(variantField.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Variant Field.
 */
export async function createVariantField(db: any, data: unknown) {
  const parsed = VariantFieldInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(variantField).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Variant Field.
 */
export async function updateVariantField(db: any, id: string, data: unknown) {
  const parsed = VariantFieldInsertSchema.partial().parse(data);
  await db.update(variantField).set({ ...parsed, modified: new Date() }).where(eq(variantField.id, id));
  return getVariantField(db, id);
}

/**
 * Delete a Variant Field by ID.
 */
export async function deleteVariantField(db: any, id: string) {
  await db.delete(variantField).where(eq(variantField.id, id));
  return { deleted: true, id };
}
