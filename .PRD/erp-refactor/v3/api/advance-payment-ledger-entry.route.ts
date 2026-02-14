// CRUD API handlers for Advance Payment Ledger Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { advancePaymentLedgerEntry } from '../db/schema.js';
import { AdvancePaymentLedgerEntrySchema, AdvancePaymentLedgerEntryInsertSchema } from '../types/advance-payment-ledger-entry.js';

export const ROUTE_PREFIX = '/advance-payment-ledger-entry';

/**
 * List Advance Payment Ledger Entry records.
 */
export async function listAdvancePaymentLedgerEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(advancePaymentLedgerEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Advance Payment Ledger Entry by ID.
 */
export async function getAdvancePaymentLedgerEntry(db: any, id: string) {
  const rows = await db.select().from(advancePaymentLedgerEntry).where(eq(advancePaymentLedgerEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Advance Payment Ledger Entry.
 */
export async function createAdvancePaymentLedgerEntry(db: any, data: unknown) {
  const parsed = AdvancePaymentLedgerEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(advancePaymentLedgerEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Advance Payment Ledger Entry.
 */
export async function updateAdvancePaymentLedgerEntry(db: any, id: string, data: unknown) {
  const parsed = AdvancePaymentLedgerEntryInsertSchema.partial().parse(data);
  await db.update(advancePaymentLedgerEntry).set({ ...parsed, modified: new Date() }).where(eq(advancePaymentLedgerEntry.id, id));
  return getAdvancePaymentLedgerEntry(db, id);
}

/**
 * Delete a Advance Payment Ledger Entry by ID.
 */
export async function deleteAdvancePaymentLedgerEntry(db: any, id: string) {
  await db.delete(advancePaymentLedgerEntry).where(eq(advancePaymentLedgerEntry.id, id));
  return { deleted: true, id };
}
