// CRUD API handlers for Subcontracting Receipt Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingReceiptItem } from '../db/schema.js';
import { SubcontractingReceiptItemSchema, SubcontractingReceiptItemInsertSchema } from '../types/subcontracting-receipt-item.js';

export const ROUTE_PREFIX = '/subcontracting-receipt-item';

/**
 * List Subcontracting Receipt Item records.
 */
export async function listSubcontractingReceiptItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingReceiptItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Receipt Item by ID.
 */
export async function getSubcontractingReceiptItem(db: any, id: string) {
  const rows = await db.select().from(subcontractingReceiptItem).where(eq(subcontractingReceiptItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Receipt Item.
 */
export async function createSubcontractingReceiptItem(db: any, data: unknown) {
  const parsed = SubcontractingReceiptItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingReceiptItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Receipt Item.
 */
export async function updateSubcontractingReceiptItem(db: any, id: string, data: unknown) {
  const parsed = SubcontractingReceiptItemInsertSchema.partial().parse(data);
  await db.update(subcontractingReceiptItem).set({ ...parsed, modified: new Date() }).where(eq(subcontractingReceiptItem.id, id));
  return getSubcontractingReceiptItem(db, id);
}

/**
 * Delete a Subcontracting Receipt Item by ID.
 */
export async function deleteSubcontractingReceiptItem(db: any, id: string) {
  await db.delete(subcontractingReceiptItem).where(eq(subcontractingReceiptItem.id, id));
  return { deleted: true, id };
}
