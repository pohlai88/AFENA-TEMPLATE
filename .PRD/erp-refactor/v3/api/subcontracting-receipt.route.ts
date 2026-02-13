// CRUD API handlers for Subcontracting Receipt
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingReceipt } from '../db/schema.js';
import { SubcontractingReceiptSchema, SubcontractingReceiptInsertSchema } from '../types/subcontracting-receipt.js';

export const ROUTE_PREFIX = '/subcontracting-receipt';

/**
 * List Subcontracting Receipt records.
 */
export async function listSubcontractingReceipt(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingReceipt).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Receipt by ID.
 */
export async function getSubcontractingReceipt(db: any, id: string) {
  const rows = await db.select().from(subcontractingReceipt).where(eq(subcontractingReceipt.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Receipt.
 */
export async function createSubcontractingReceipt(db: any, data: unknown) {
  const parsed = SubcontractingReceiptInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingReceipt).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Receipt.
 */
export async function updateSubcontractingReceipt(db: any, id: string, data: unknown) {
  const parsed = SubcontractingReceiptInsertSchema.partial().parse(data);
  await db.update(subcontractingReceipt).set({ ...parsed, modified: new Date() }).where(eq(subcontractingReceipt.id, id));
  return getSubcontractingReceipt(db, id);
}

/**
 * Delete a Subcontracting Receipt by ID.
 */
export async function deleteSubcontractingReceipt(db: any, id: string) {
  await db.delete(subcontractingReceipt).where(eq(subcontractingReceipt.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Subcontracting Receipt (set docstatus = 1).
 */
export async function submitSubcontractingReceipt(db: any, id: string) {
  await db.update(subcontractingReceipt).set({ docstatus: 1, modified: new Date() }).where(eq(subcontractingReceipt.id, id));
  return getSubcontractingReceipt(db, id);
}

/**
 * Cancel a Subcontracting Receipt (set docstatus = 2).
 */
export async function cancelSubcontractingReceipt(db: any, id: string) {
  await db.update(subcontractingReceipt).set({ docstatus: 2, modified: new Date() }).where(eq(subcontractingReceipt.id, id));
  return getSubcontractingReceipt(db, id);
}
