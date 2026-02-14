// CRUD API handlers for Account Closing Balance
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { accountClosingBalance } from '../db/schema.js';
import { AccountClosingBalanceSchema, AccountClosingBalanceInsertSchema } from '../types/account-closing-balance.js';

export const ROUTE_PREFIX = '/account-closing-balance';

/**
 * List Account Closing Balance records.
 */
export async function listAccountClosingBalance(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(accountClosingBalance).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Account Closing Balance by ID.
 */
export async function getAccountClosingBalance(db: any, id: string) {
  const rows = await db.select().from(accountClosingBalance).where(eq(accountClosingBalance.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Account Closing Balance.
 */
export async function createAccountClosingBalance(db: any, data: unknown) {
  const parsed = AccountClosingBalanceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(accountClosingBalance).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Account Closing Balance.
 */
export async function updateAccountClosingBalance(db: any, id: string, data: unknown) {
  const parsed = AccountClosingBalanceInsertSchema.partial().parse(data);
  await db.update(accountClosingBalance).set({ ...parsed, modified: new Date() }).where(eq(accountClosingBalance.id, id));
  return getAccountClosingBalance(db, id);
}

/**
 * Delete a Account Closing Balance by ID.
 */
export async function deleteAccountClosingBalance(db: any, id: string) {
  await db.delete(accountClosingBalance).where(eq(accountClosingBalance.id, id));
  return { deleted: true, id };
}
