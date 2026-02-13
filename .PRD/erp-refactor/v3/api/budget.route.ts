// CRUD API handlers for Budget
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { budget } from '../db/schema.js';
import { BudgetSchema, BudgetInsertSchema } from '../types/budget.js';

export const ROUTE_PREFIX = '/budget';

/**
 * List Budget records.
 */
export async function listBudget(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(budget).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Budget by ID.
 */
export async function getBudget(db: any, id: string) {
  const rows = await db.select().from(budget).where(eq(budget.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Budget.
 */
export async function createBudget(db: any, data: unknown) {
  const parsed = BudgetInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(budget).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Budget.
 */
export async function updateBudget(db: any, id: string, data: unknown) {
  const parsed = BudgetInsertSchema.partial().parse(data);
  await db.update(budget).set({ ...parsed, modified: new Date() }).where(eq(budget.id, id));
  return getBudget(db, id);
}

/**
 * Delete a Budget by ID.
 */
export async function deleteBudget(db: any, id: string) {
  await db.delete(budget).where(eq(budget.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Budget (set docstatus = 1).
 */
export async function submitBudget(db: any, id: string) {
  await db.update(budget).set({ docstatus: 1, modified: new Date() }).where(eq(budget.id, id));
  return getBudget(db, id);
}

/**
 * Cancel a Budget (set docstatus = 2).
 */
export async function cancelBudget(db: any, id: string) {
  await db.update(budget).set({ docstatus: 2, modified: new Date() }).where(eq(budget.id, id));
  return getBudget(db, id);
}
