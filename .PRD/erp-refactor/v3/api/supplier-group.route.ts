// CRUD API handlers for Supplier Group
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierGroup } from '../db/schema.js';
import { SupplierGroupSchema, SupplierGroupInsertSchema } from '../types/supplier-group.js';

export const ROUTE_PREFIX = '/supplier-group';

/**
 * List Supplier Group records.
 */
export async function listSupplierGroup(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierGroup).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Group by ID.
 */
export async function getSupplierGroup(db: any, id: string) {
  const rows = await db.select().from(supplierGroup).where(eq(supplierGroup.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Group.
 */
export async function createSupplierGroup(db: any, data: unknown) {
  const parsed = SupplierGroupInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierGroup).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Group.
 */
export async function updateSupplierGroup(db: any, id: string, data: unknown) {
  const parsed = SupplierGroupInsertSchema.partial().parse(data);
  await db.update(supplierGroup).set({ ...parsed, modified: new Date() }).where(eq(supplierGroup.id, id));
  return getSupplierGroup(db, id);
}

/**
 * Delete a Supplier Group by ID.
 */
export async function deleteSupplierGroup(db: any, id: string) {
  await db.delete(supplierGroup).where(eq(supplierGroup.id, id));
  return { deleted: true, id };
}
