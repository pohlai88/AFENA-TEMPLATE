// CRUD API handlers for Share Transfer
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shareTransfer } from '../db/schema.js';
import { ShareTransferSchema, ShareTransferInsertSchema } from '../types/share-transfer.js';

export const ROUTE_PREFIX = '/share-transfer';

/**
 * List Share Transfer records.
 */
export async function listShareTransfer(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shareTransfer).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Share Transfer by ID.
 */
export async function getShareTransfer(db: any, id: string) {
  const rows = await db.select().from(shareTransfer).where(eq(shareTransfer.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Share Transfer.
 */
export async function createShareTransfer(db: any, data: unknown) {
  const parsed = ShareTransferInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shareTransfer).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Share Transfer.
 */
export async function updateShareTransfer(db: any, id: string, data: unknown) {
  const parsed = ShareTransferInsertSchema.partial().parse(data);
  await db.update(shareTransfer).set({ ...parsed, modified: new Date() }).where(eq(shareTransfer.id, id));
  return getShareTransfer(db, id);
}

/**
 * Delete a Share Transfer by ID.
 */
export async function deleteShareTransfer(db: any, id: string) {
  await db.delete(shareTransfer).where(eq(shareTransfer.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Share Transfer (set docstatus = 1).
 */
export async function submitShareTransfer(db: any, id: string) {
  await db.update(shareTransfer).set({ docstatus: 1, modified: new Date() }).where(eq(shareTransfer.id, id));
  return getShareTransfer(db, id);
}

/**
 * Cancel a Share Transfer (set docstatus = 2).
 */
export async function cancelShareTransfer(db: any, id: string) {
  await db.update(shareTransfer).set({ docstatus: 2, modified: new Date() }).where(eq(shareTransfer.id, id));
  return getShareTransfer(db, id);
}
