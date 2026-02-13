// CRUD API handlers for Supplier
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplier } from '../db/schema.js';
import { SupplierSchema, SupplierInsertSchema } from '../types/supplier.js';

export const ROUTE_PREFIX = '/supplier';

/**
 * List Supplier records.
 */
export async function listSupplier(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplier).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier by ID.
 */
export async function getSupplier(db: any, id: string) {
  const rows = await db.select().from(supplier).where(eq(supplier.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier.
 */
export async function createSupplier(db: any, data: unknown) {
  const parsed = SupplierInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplier).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier.
 */
export async function updateSupplier(db: any, id: string, data: unknown) {
  const parsed = SupplierInsertSchema.partial().parse(data);
  await db.update(supplier).set({ ...parsed, modified: new Date() }).where(eq(supplier.id, id));
  return getSupplier(db, id);
}

/**
 * Delete a Supplier by ID.
 */
export async function deleteSupplier(db: any, id: string) {
  await db.delete(supplier).where(eq(supplier.id, id));
  return { deleted: true, id };
}
