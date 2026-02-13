// CRUD API handlers for Budget Distribution
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { budgetDistribution } from '../db/schema.js';
import { BudgetDistributionSchema, BudgetDistributionInsertSchema } from '../types/budget-distribution.js';

export const ROUTE_PREFIX = '/budget-distribution';

/**
 * List Budget Distribution records.
 */
export async function listBudgetDistribution(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(budgetDistribution).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Budget Distribution by ID.
 */
export async function getBudgetDistribution(db: any, id: string) {
  const rows = await db.select().from(budgetDistribution).where(eq(budgetDistribution.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Budget Distribution.
 */
export async function createBudgetDistribution(db: any, data: unknown) {
  const parsed = BudgetDistributionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(budgetDistribution).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Budget Distribution.
 */
export async function updateBudgetDistribution(db: any, id: string, data: unknown) {
  const parsed = BudgetDistributionInsertSchema.partial().parse(data);
  await db.update(budgetDistribution).set({ ...parsed, modified: new Date() }).where(eq(budgetDistribution.id, id));
  return getBudgetDistribution(db, id);
}

/**
 * Delete a Budget Distribution by ID.
 */
export async function deleteBudgetDistribution(db: any, id: string) {
  await db.delete(budgetDistribution).where(eq(budgetDistribution.id, id));
  return { deleted: true, id };
}
