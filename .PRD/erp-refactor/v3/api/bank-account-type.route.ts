// CRUD API handlers for Bank Account Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankAccountType } from '../db/schema.js';
import { BankAccountTypeSchema, BankAccountTypeInsertSchema } from '../types/bank-account-type.js';

export const ROUTE_PREFIX = '/bank-account-type';

/**
 * List Bank Account Type records.
 */
export async function listBankAccountType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankAccountType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Account Type by ID.
 */
export async function getBankAccountType(db: any, id: string) {
  const rows = await db.select().from(bankAccountType).where(eq(bankAccountType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Account Type.
 */
export async function createBankAccountType(db: any, data: unknown) {
  const parsed = BankAccountTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankAccountType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Account Type.
 */
export async function updateBankAccountType(db: any, id: string, data: unknown) {
  const parsed = BankAccountTypeInsertSchema.partial().parse(data);
  await db.update(bankAccountType).set({ ...parsed, modified: new Date() }).where(eq(bankAccountType.id, id));
  return getBankAccountType(db, id);
}

/**
 * Delete a Bank Account Type by ID.
 */
export async function deleteBankAccountType(db: any, id: string) {
  await db.delete(bankAccountType).where(eq(bankAccountType.id, id));
  return { deleted: true, id };
}
