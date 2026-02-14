// CRUD API handlers for Subcontracting Receipt Supplied Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingReceiptSuppliedItem } from '../db/schema.js';
import { SubcontractingReceiptSuppliedItemSchema, SubcontractingReceiptSuppliedItemInsertSchema } from '../types/subcontracting-receipt-supplied-item.js';

export const ROUTE_PREFIX = '/subcontracting-receipt-supplied-item';

/**
 * List Subcontracting Receipt Supplied Item records.
 */
export async function listSubcontractingReceiptSuppliedItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingReceiptSuppliedItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Receipt Supplied Item by ID.
 */
export async function getSubcontractingReceiptSuppliedItem(db: any, id: string) {
  const rows = await db.select().from(subcontractingReceiptSuppliedItem).where(eq(subcontractingReceiptSuppliedItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Receipt Supplied Item.
 */
export async function createSubcontractingReceiptSuppliedItem(db: any, data: unknown) {
  const parsed = SubcontractingReceiptSuppliedItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingReceiptSuppliedItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Receipt Supplied Item.
 */
export async function updateSubcontractingReceiptSuppliedItem(db: any, id: string, data: unknown) {
  const parsed = SubcontractingReceiptSuppliedItemInsertSchema.partial().parse(data);
  await db.update(subcontractingReceiptSuppliedItem).set({ ...parsed, modified: new Date() }).where(eq(subcontractingReceiptSuppliedItem.id, id));
  return getSubcontractingReceiptSuppliedItem(db, id);
}

/**
 * Delete a Subcontracting Receipt Supplied Item by ID.
 */
export async function deleteSubcontractingReceiptSuppliedItem(db: any, id: string) {
  await db.delete(subcontractingReceiptSuppliedItem).where(eq(subcontractingReceiptSuppliedItem.id, id));
  return { deleted: true, id };
}
