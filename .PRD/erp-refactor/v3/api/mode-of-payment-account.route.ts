// CRUD API handlers for Mode of Payment Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { modeOfPaymentAccount } from '../db/schema.js';
import { ModeOfPaymentAccountSchema, ModeOfPaymentAccountInsertSchema } from '../types/mode-of-payment-account.js';

export const ROUTE_PREFIX = '/mode-of-payment-account';

/**
 * List Mode of Payment Account records.
 */
export async function listModeOfPaymentAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(modeOfPaymentAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Mode of Payment Account by ID.
 */
export async function getModeOfPaymentAccount(db: any, id: string) {
  const rows = await db.select().from(modeOfPaymentAccount).where(eq(modeOfPaymentAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Mode of Payment Account.
 */
export async function createModeOfPaymentAccount(db: any, data: unknown) {
  const parsed = ModeOfPaymentAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(modeOfPaymentAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Mode of Payment Account.
 */
export async function updateModeOfPaymentAccount(db: any, id: string, data: unknown) {
  const parsed = ModeOfPaymentAccountInsertSchema.partial().parse(data);
  await db.update(modeOfPaymentAccount).set({ ...parsed, modified: new Date() }).where(eq(modeOfPaymentAccount.id, id));
  return getModeOfPaymentAccount(db, id);
}

/**
 * Delete a Mode of Payment Account by ID.
 */
export async function deleteModeOfPaymentAccount(db: any, id: string) {
  await db.delete(modeOfPaymentAccount).where(eq(modeOfPaymentAccount.id, id));
  return { deleted: true, id };
}
