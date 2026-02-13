// CRUD API handlers for Bank Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankAccount } from '../db/schema.js';
import { BankAccountSchema, BankAccountInsertSchema } from '../types/bank-account.js';

export const ROUTE_PREFIX = '/bank-account';

/**
 * List Bank Account records.
 */
export async function listBankAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Account by ID.
 */
export async function getBankAccount(db: any, id: string) {
  const rows = await db.select().from(bankAccount).where(eq(bankAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Account.
 */
export async function createBankAccount(db: any, data: unknown) {
  const parsed = BankAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Account.
 */
export async function updateBankAccount(db: any, id: string, data: unknown) {
  const parsed = BankAccountInsertSchema.partial().parse(data);
  await db.update(bankAccount).set({ ...parsed, modified: new Date() }).where(eq(bankAccount.id, id));
  return getBankAccount(db, id);
}

/**
 * Delete a Bank Account by ID.
 */
export async function deleteBankAccount(db: any, id: string) {
  await db.delete(bankAccount).where(eq(bankAccount.id, id));
  return { deleted: true, id };
}
