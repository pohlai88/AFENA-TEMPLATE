// CRUD API handlers for Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { account } from '../db/schema.js';
import { AccountSchema, AccountInsertSchema } from '../types/account.js';

export const ROUTE_PREFIX = '/account';

/**
 * List Account records.
 */
export async function listAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(account).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Account by ID.
 */
export async function getAccount(db: any, id: string) {
  const rows = await db.select().from(account).where(eq(account.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Account.
 */
export async function createAccount(db: any, data: unknown) {
  const parsed = AccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(account).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Account.
 */
export async function updateAccount(db: any, id: string, data: unknown) {
  const parsed = AccountInsertSchema.partial().parse(data);
  await db.update(account).set({ ...parsed, modified: new Date() }).where(eq(account.id, id));
  return getAccount(db, id);
}

/**
 * Delete a Account by ID.
 */
export async function deleteAccount(db: any, id: string) {
  await db.delete(account).where(eq(account.id, id));
  return { deleted: true, id };
}
