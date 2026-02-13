// CRUD API handlers for Supplier Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierItem } from '../db/schema.js';
import { SupplierItemSchema, SupplierItemInsertSchema } from '../types/supplier-item.js';

export const ROUTE_PREFIX = '/supplier-item';

/**
 * List Supplier Item records.
 */
export async function listSupplierItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Item by ID.
 */
export async function getSupplierItem(db: any, id: string) {
  const rows = await db.select().from(supplierItem).where(eq(supplierItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Item.
 */
export async function createSupplierItem(db: any, data: unknown) {
  const parsed = SupplierItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Item.
 */
export async function updateSupplierItem(db: any, id: string, data: unknown) {
  const parsed = SupplierItemInsertSchema.partial().parse(data);
  await db.update(supplierItem).set({ ...parsed, modified: new Date() }).where(eq(supplierItem.id, id));
  return getSupplierItem(db, id);
}

/**
 * Delete a Supplier Item by ID.
 */
export async function deleteSupplierItem(db: any, id: string) {
  await db.delete(supplierItem).where(eq(supplierItem.id, id));
  return { deleted: true, id };
}
