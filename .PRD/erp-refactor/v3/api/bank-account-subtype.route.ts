// CRUD API handlers for Bank Account Subtype
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankAccountSubtype } from '../db/schema.js';
import { BankAccountSubtypeSchema, BankAccountSubtypeInsertSchema } from '../types/bank-account-subtype.js';

export const ROUTE_PREFIX = '/bank-account-subtype';

/**
 * List Bank Account Subtype records.
 */
export async function listBankAccountSubtype(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankAccountSubtype).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Account Subtype by ID.
 */
export async function getBankAccountSubtype(db: any, id: string) {
  const rows = await db.select().from(bankAccountSubtype).where(eq(bankAccountSubtype.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Account Subtype.
 */
export async function createBankAccountSubtype(db: any, data: unknown) {
  const parsed = BankAccountSubtypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankAccountSubtype).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Account Subtype.
 */
export async function updateBankAccountSubtype(db: any, id: string, data: unknown) {
  const parsed = BankAccountSubtypeInsertSchema.partial().parse(data);
  await db.update(bankAccountSubtype).set({ ...parsed, modified: new Date() }).where(eq(bankAccountSubtype.id, id));
  return getBankAccountSubtype(db, id);
}

/**
 * Delete a Bank Account Subtype by ID.
 */
export async function deleteBankAccountSubtype(db: any, id: string) {
  await db.delete(bankAccountSubtype).where(eq(bankAccountSubtype.id, id));
  return { deleted: true, id };
}
