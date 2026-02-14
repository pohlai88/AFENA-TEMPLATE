// CRUD API handlers for Bank
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bank } from '../db/schema.js';
import { BankSchema, BankInsertSchema } from '../types/bank.js';

export const ROUTE_PREFIX = '/bank';

/**
 * List Bank records.
 */
export async function listBank(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bank).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank by ID.
 */
export async function getBank(db: any, id: string) {
  const rows = await db.select().from(bank).where(eq(bank.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank.
 */
export async function createBank(db: any, data: unknown) {
  const parsed = BankInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bank).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank.
 */
export async function updateBank(db: any, id: string, data: unknown) {
  const parsed = BankInsertSchema.partial().parse(data);
  await db.update(bank).set({ ...parsed, modified: new Date() }).where(eq(bank.id, id));
  return getBank(db, id);
}

/**
 * Delete a Bank by ID.
 */
export async function deleteBank(db: any, id: string) {
  await db.delete(bank).where(eq(bank.id, id));
  return { deleted: true, id };
}
