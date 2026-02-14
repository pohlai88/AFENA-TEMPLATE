// CRUD API handlers for Supplier Group Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierGroupItem } from '../db/schema.js';
import { SupplierGroupItemSchema, SupplierGroupItemInsertSchema } from '../types/supplier-group-item.js';

export const ROUTE_PREFIX = '/supplier-group-item';

/**
 * List Supplier Group Item records.
 */
export async function listSupplierGroupItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierGroupItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Group Item by ID.
 */
export async function getSupplierGroupItem(db: any, id: string) {
  const rows = await db.select().from(supplierGroupItem).where(eq(supplierGroupItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Group Item.
 */
export async function createSupplierGroupItem(db: any, data: unknown) {
  const parsed = SupplierGroupItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierGroupItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Group Item.
 */
export async function updateSupplierGroupItem(db: any, id: string, data: unknown) {
  const parsed = SupplierGroupItemInsertSchema.partial().parse(data);
  await db.update(supplierGroupItem).set({ ...parsed, modified: new Date() }).where(eq(supplierGroupItem.id, id));
  return getSupplierGroupItem(db, id);
}

/**
 * Delete a Supplier Group Item by ID.
 */
export async function deleteSupplierGroupItem(db: any, id: string) {
  await db.delete(supplierGroupItem).where(eq(supplierGroupItem.id, id));
  return { deleted: true, id };
}
