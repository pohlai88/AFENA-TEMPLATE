// CRUD API handlers for Payment Ledger Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentLedgerEntry } from '../db/schema.js';
import { PaymentLedgerEntrySchema, PaymentLedgerEntryInsertSchema } from '../types/payment-ledger-entry.js';

export const ROUTE_PREFIX = '/payment-ledger-entry';

/**
 * List Payment Ledger Entry records.
 */
export async function listPaymentLedgerEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentLedgerEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Ledger Entry by ID.
 */
export async function getPaymentLedgerEntry(db: any, id: string) {
  const rows = await db.select().from(paymentLedgerEntry).where(eq(paymentLedgerEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Ledger Entry.
 */
export async function createPaymentLedgerEntry(db: any, data: unknown) {
  const parsed = PaymentLedgerEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentLedgerEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Ledger Entry.
 */
export async function updatePaymentLedgerEntry(db: any, id: string, data: unknown) {
  const parsed = PaymentLedgerEntryInsertSchema.partial().parse(data);
  await db.update(paymentLedgerEntry).set({ ...parsed, modified: new Date() }).where(eq(paymentLedgerEntry.id, id));
  return getPaymentLedgerEntry(db, id);
}

/**
 * Delete a Payment Ledger Entry by ID.
 */
export async function deletePaymentLedgerEntry(db: any, id: string) {
  await db.delete(paymentLedgerEntry).where(eq(paymentLedgerEntry.id, id));
  return { deleted: true, id };
}
