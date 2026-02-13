// CRUD API handlers for Monthly Distribution Percentage
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { monthlyDistributionPercentage } from '../db/schema.js';
import { MonthlyDistributionPercentageSchema, MonthlyDistributionPercentageInsertSchema } from '../types/monthly-distribution-percentage.js';

export const ROUTE_PREFIX = '/monthly-distribution-percentage';

/**
 * List Monthly Distribution Percentage records.
 */
export async function listMonthlyDistributionPercentage(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(monthlyDistributionPercentage).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Monthly Distribution Percentage by ID.
 */
export async function getMonthlyDistributionPercentage(db: any, id: string) {
  const rows = await db.select().from(monthlyDistributionPercentage).where(eq(monthlyDistributionPercentage.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Monthly Distribution Percentage.
 */
export async function createMonthlyDistributionPercentage(db: any, data: unknown) {
  const parsed = MonthlyDistributionPercentageInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(monthlyDistributionPercentage).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Monthly Distribution Percentage.
 */
export async function updateMonthlyDistributionPercentage(db: any, id: string, data: unknown) {
  const parsed = MonthlyDistributionPercentageInsertSchema.partial().parse(data);
  await db.update(monthlyDistributionPercentage).set({ ...parsed, modified: new Date() }).where(eq(monthlyDistributionPercentage.id, id));
  return getMonthlyDistributionPercentage(db, id);
}

/**
 * Delete a Monthly Distribution Percentage by ID.
 */
export async function deleteMonthlyDistributionPercentage(db: any, id: string) {
  await db.delete(monthlyDistributionPercentage).where(eq(monthlyDistributionPercentage.id, id));
  return { deleted: true, id };
}
