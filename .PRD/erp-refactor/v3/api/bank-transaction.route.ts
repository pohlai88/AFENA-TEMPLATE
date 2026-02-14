// CRUD API handlers for Bank Transaction
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankTransaction } from '../db/schema.js';
import { BankTransactionSchema, BankTransactionInsertSchema } from '../types/bank-transaction.js';

export const ROUTE_PREFIX = '/bank-transaction';

/**
 * List Bank Transaction records.
 */
export async function listBankTransaction(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankTransaction).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Transaction by ID.
 */
export async function getBankTransaction(db: any, id: string) {
  const rows = await db.select().from(bankTransaction).where(eq(bankTransaction.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Transaction.
 */
export async function createBankTransaction(db: any, data: unknown) {
  const parsed = BankTransactionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankTransaction).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Transaction.
 */
export async function updateBankTransaction(db: any, id: string, data: unknown) {
  const parsed = BankTransactionInsertSchema.partial().parse(data);
  await db.update(bankTransaction).set({ ...parsed, modified: new Date() }).where(eq(bankTransaction.id, id));
  return getBankTransaction(db, id);
}

/**
 * Delete a Bank Transaction by ID.
 */
export async function deleteBankTransaction(db: any, id: string) {
  await db.delete(bankTransaction).where(eq(bankTransaction.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Bank Transaction (set docstatus = 1).
 */
export async function submitBankTransaction(db: any, id: string) {
  await db.update(bankTransaction).set({ docstatus: 1, modified: new Date() }).where(eq(bankTransaction.id, id));
  return getBankTransaction(db, id);
}

/**
 * Cancel a Bank Transaction (set docstatus = 2).
 */
export async function cancelBankTransaction(db: any, id: string) {
  await db.update(bankTransaction).set({ docstatus: 2, modified: new Date() }).where(eq(bankTransaction.id, id));
  return getBankTransaction(db, id);
}
