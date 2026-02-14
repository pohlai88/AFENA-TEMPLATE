// CRUD API handlers for Budget Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { budgetAccount } from '../db/schema.js';
import { BudgetAccountSchema, BudgetAccountInsertSchema } from '../types/budget-account.js';

export const ROUTE_PREFIX = '/budget-account';

/**
 * List Budget Account records.
 */
export async function listBudgetAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(budgetAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Budget Account by ID.
 */
export async function getBudgetAccount(db: any, id: string) {
  const rows = await db.select().from(budgetAccount).where(eq(budgetAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Budget Account.
 */
export async function createBudgetAccount(db: any, data: unknown) {
  const parsed = BudgetAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(budgetAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Budget Account.
 */
export async function updateBudgetAccount(db: any, id: string, data: unknown) {
  const parsed = BudgetAccountInsertSchema.partial().parse(data);
  await db.update(budgetAccount).set({ ...parsed, modified: new Date() }).where(eq(budgetAccount.id, id));
  return getBudgetAccount(db, id);
}

/**
 * Delete a Budget Account by ID.
 */
export async function deleteBudgetAccount(db: any, id: string) {
  await db.delete(budgetAccount).where(eq(budgetAccount.id, id));
  return { deleted: true, id };
}
