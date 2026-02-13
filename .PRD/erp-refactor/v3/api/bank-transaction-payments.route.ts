// CRUD API handlers for Bank Transaction Payments
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankTransactionPayments } from '../db/schema.js';
import { BankTransactionPaymentsSchema, BankTransactionPaymentsInsertSchema } from '../types/bank-transaction-payments.js';

export const ROUTE_PREFIX = '/bank-transaction-payments';

/**
 * List Bank Transaction Payments records.
 */
export async function listBankTransactionPayments(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankTransactionPayments).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Transaction Payments by ID.
 */
export async function getBankTransactionPayments(db: any, id: string) {
  const rows = await db.select().from(bankTransactionPayments).where(eq(bankTransactionPayments.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Transaction Payments.
 */
export async function createBankTransactionPayments(db: any, data: unknown) {
  const parsed = BankTransactionPaymentsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankTransactionPayments).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Transaction Payments.
 */
export async function updateBankTransactionPayments(db: any, id: string, data: unknown) {
  const parsed = BankTransactionPaymentsInsertSchema.partial().parse(data);
  await db.update(bankTransactionPayments).set({ ...parsed, modified: new Date() }).where(eq(bankTransactionPayments.id, id));
  return getBankTransactionPayments(db, id);
}

/**
 * Delete a Bank Transaction Payments by ID.
 */
export async function deleteBankTransactionPayments(db: any, id: string) {
  await db.delete(bankTransactionPayments).where(eq(bankTransactionPayments.id, id));
  return { deleted: true, id };
}
