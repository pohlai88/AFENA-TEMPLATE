// CRUD API handlers for Repost Payment Ledger Items
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { repostPaymentLedgerItems } from '../db/schema.js';
import { RepostPaymentLedgerItemsSchema, RepostPaymentLedgerItemsInsertSchema } from '../types/repost-payment-ledger-items.js';

export const ROUTE_PREFIX = '/repost-payment-ledger-items';

/**
 * List Repost Payment Ledger Items records.
 */
export async function listRepostPaymentLedgerItems(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(repostPaymentLedgerItems).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Repost Payment Ledger Items by ID.
 */
export async function getRepostPaymentLedgerItems(db: any, id: string) {
  const rows = await db.select().from(repostPaymentLedgerItems).where(eq(repostPaymentLedgerItems.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Repost Payment Ledger Items.
 */
export async function createRepostPaymentLedgerItems(db: any, data: unknown) {
  const parsed = RepostPaymentLedgerItemsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(repostPaymentLedgerItems).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Repost Payment Ledger Items.
 */
export async function updateRepostPaymentLedgerItems(db: any, id: string, data: unknown) {
  const parsed = RepostPaymentLedgerItemsInsertSchema.partial().parse(data);
  await db.update(repostPaymentLedgerItems).set({ ...parsed, modified: new Date() }).where(eq(repostPaymentLedgerItems.id, id));
  return getRepostPaymentLedgerItems(db, id);
}

/**
 * Delete a Repost Payment Ledger Items by ID.
 */
export async function deleteRepostPaymentLedgerItems(db: any, id: string) {
  await db.delete(repostPaymentLedgerItems).where(eq(repostPaymentLedgerItems.id, id));
  return { deleted: true, id };
}
