// CRUD API handlers for Repost Payment Ledger
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { repostPaymentLedger } from '../db/schema.js';
import { RepostPaymentLedgerSchema, RepostPaymentLedgerInsertSchema } from '../types/repost-payment-ledger.js';

export const ROUTE_PREFIX = '/repost-payment-ledger';

/**
 * List Repost Payment Ledger records.
 */
export async function listRepostPaymentLedger(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(repostPaymentLedger).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Repost Payment Ledger by ID.
 */
export async function getRepostPaymentLedger(db: any, id: string) {
  const rows = await db.select().from(repostPaymentLedger).where(eq(repostPaymentLedger.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Repost Payment Ledger.
 */
export async function createRepostPaymentLedger(db: any, data: unknown) {
  const parsed = RepostPaymentLedgerInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(repostPaymentLedger).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Repost Payment Ledger.
 */
export async function updateRepostPaymentLedger(db: any, id: string, data: unknown) {
  const parsed = RepostPaymentLedgerInsertSchema.partial().parse(data);
  await db.update(repostPaymentLedger).set({ ...parsed, modified: new Date() }).where(eq(repostPaymentLedger.id, id));
  return getRepostPaymentLedger(db, id);
}

/**
 * Delete a Repost Payment Ledger by ID.
 */
export async function deleteRepostPaymentLedger(db: any, id: string) {
  await db.delete(repostPaymentLedger).where(eq(repostPaymentLedger.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Repost Payment Ledger (set docstatus = 1).
 */
export async function submitRepostPaymentLedger(db: any, id: string) {
  await db.update(repostPaymentLedger).set({ docstatus: 1, modified: new Date() }).where(eq(repostPaymentLedger.id, id));
  return getRepostPaymentLedger(db, id);
}

/**
 * Cancel a Repost Payment Ledger (set docstatus = 2).
 */
export async function cancelRepostPaymentLedger(db: any, id: string) {
  await db.update(repostPaymentLedger).set({ docstatus: 2, modified: new Date() }).where(eq(repostPaymentLedger.id, id));
  return getRepostPaymentLedger(db, id);
}
