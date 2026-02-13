// CRUD API handlers for Repost Accounting Ledger Items
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { repostAccountingLedgerItems } from '../db/schema.js';
import { RepostAccountingLedgerItemsSchema, RepostAccountingLedgerItemsInsertSchema } from '../types/repost-accounting-ledger-items.js';

export const ROUTE_PREFIX = '/repost-accounting-ledger-items';

/**
 * List Repost Accounting Ledger Items records.
 */
export async function listRepostAccountingLedgerItems(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(repostAccountingLedgerItems).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Repost Accounting Ledger Items by ID.
 */
export async function getRepostAccountingLedgerItems(db: any, id: string) {
  const rows = await db.select().from(repostAccountingLedgerItems).where(eq(repostAccountingLedgerItems.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Repost Accounting Ledger Items.
 */
export async function createRepostAccountingLedgerItems(db: any, data: unknown) {
  const parsed = RepostAccountingLedgerItemsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(repostAccountingLedgerItems).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Repost Accounting Ledger Items.
 */
export async function updateRepostAccountingLedgerItems(db: any, id: string, data: unknown) {
  const parsed = RepostAccountingLedgerItemsInsertSchema.partial().parse(data);
  await db.update(repostAccountingLedgerItems).set({ ...parsed, modified: new Date() }).where(eq(repostAccountingLedgerItems.id, id));
  return getRepostAccountingLedgerItems(db, id);
}

/**
 * Delete a Repost Accounting Ledger Items by ID.
 */
export async function deleteRepostAccountingLedgerItems(db: any, id: string) {
  await db.delete(repostAccountingLedgerItems).where(eq(repostAccountingLedgerItems.id, id));
  return { deleted: true, id };
}
