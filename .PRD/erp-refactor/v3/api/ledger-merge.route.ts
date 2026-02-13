// CRUD API handlers for Ledger Merge
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { ledgerMerge } from '../db/schema.js';
import { LedgerMergeSchema, LedgerMergeInsertSchema } from '../types/ledger-merge.js';

export const ROUTE_PREFIX = '/ledger-merge';

/**
 * List Ledger Merge records.
 */
export async function listLedgerMerge(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(ledgerMerge).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Ledger Merge by ID.
 */
export async function getLedgerMerge(db: any, id: string) {
  const rows = await db.select().from(ledgerMerge).where(eq(ledgerMerge.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Ledger Merge.
 */
export async function createLedgerMerge(db: any, data: unknown) {
  const parsed = LedgerMergeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(ledgerMerge).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Ledger Merge.
 */
export async function updateLedgerMerge(db: any, id: string, data: unknown) {
  const parsed = LedgerMergeInsertSchema.partial().parse(data);
  await db.update(ledgerMerge).set({ ...parsed, modified: new Date() }).where(eq(ledgerMerge.id, id));
  return getLedgerMerge(db, id);
}

/**
 * Delete a Ledger Merge by ID.
 */
export async function deleteLedgerMerge(db: any, id: string) {
  await db.delete(ledgerMerge).where(eq(ledgerMerge.id, id));
  return { deleted: true, id };
}
