// CRUD API handlers for Ledger Merge Accounts
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { ledgerMergeAccounts } from '../db/schema.js';
import { LedgerMergeAccountsSchema, LedgerMergeAccountsInsertSchema } from '../types/ledger-merge-accounts.js';

export const ROUTE_PREFIX = '/ledger-merge-accounts';

/**
 * List Ledger Merge Accounts records.
 */
export async function listLedgerMergeAccounts(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(ledgerMergeAccounts).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Ledger Merge Accounts by ID.
 */
export async function getLedgerMergeAccounts(db: any, id: string) {
  const rows = await db.select().from(ledgerMergeAccounts).where(eq(ledgerMergeAccounts.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Ledger Merge Accounts.
 */
export async function createLedgerMergeAccounts(db: any, data: unknown) {
  const parsed = LedgerMergeAccountsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(ledgerMergeAccounts).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Ledger Merge Accounts.
 */
export async function updateLedgerMergeAccounts(db: any, id: string, data: unknown) {
  const parsed = LedgerMergeAccountsInsertSchema.partial().parse(data);
  await db.update(ledgerMergeAccounts).set({ ...parsed, modified: new Date() }).where(eq(ledgerMergeAccounts.id, id));
  return getLedgerMergeAccounts(db, id);
}

/**
 * Delete a Ledger Merge Accounts by ID.
 */
export async function deleteLedgerMergeAccounts(db: any, id: string) {
  await db.delete(ledgerMergeAccounts).where(eq(ledgerMergeAccounts.id, id));
  return { deleted: true, id };
}
