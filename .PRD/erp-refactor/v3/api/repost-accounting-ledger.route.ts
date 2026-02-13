// CRUD API handlers for Repost Accounting Ledger
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { repostAccountingLedger } from '../db/schema.js';
import { RepostAccountingLedgerSchema, RepostAccountingLedgerInsertSchema } from '../types/repost-accounting-ledger.js';

export const ROUTE_PREFIX = '/repost-accounting-ledger';

/**
 * List Repost Accounting Ledger records.
 */
export async function listRepostAccountingLedger(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(repostAccountingLedger).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Repost Accounting Ledger by ID.
 */
export async function getRepostAccountingLedger(db: any, id: string) {
  const rows = await db.select().from(repostAccountingLedger).where(eq(repostAccountingLedger.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Repost Accounting Ledger.
 */
export async function createRepostAccountingLedger(db: any, data: unknown) {
  const parsed = RepostAccountingLedgerInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(repostAccountingLedger).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Repost Accounting Ledger.
 */
export async function updateRepostAccountingLedger(db: any, id: string, data: unknown) {
  const parsed = RepostAccountingLedgerInsertSchema.partial().parse(data);
  await db.update(repostAccountingLedger).set({ ...parsed, modified: new Date() }).where(eq(repostAccountingLedger.id, id));
  return getRepostAccountingLedger(db, id);
}

/**
 * Delete a Repost Accounting Ledger by ID.
 */
export async function deleteRepostAccountingLedger(db: any, id: string) {
  await db.delete(repostAccountingLedger).where(eq(repostAccountingLedger.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Repost Accounting Ledger (set docstatus = 1).
 */
export async function submitRepostAccountingLedger(db: any, id: string) {
  await db.update(repostAccountingLedger).set({ docstatus: 1, modified: new Date() }).where(eq(repostAccountingLedger.id, id));
  return getRepostAccountingLedger(db, id);
}

/**
 * Cancel a Repost Accounting Ledger (set docstatus = 2).
 */
export async function cancelRepostAccountingLedger(db: any, id: string) {
  await db.update(repostAccountingLedger).set({ docstatus: 2, modified: new Date() }).where(eq(repostAccountingLedger.id, id));
  return getRepostAccountingLedger(db, id);
}
