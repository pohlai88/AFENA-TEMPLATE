// CRUD API handlers for Monthly Distribution
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { monthlyDistribution } from '../db/schema.js';
import { MonthlyDistributionSchema, MonthlyDistributionInsertSchema } from '../types/monthly-distribution.js';

export const ROUTE_PREFIX = '/monthly-distribution';

/**
 * List Monthly Distribution records.
 */
export async function listMonthlyDistribution(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(monthlyDistribution).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Monthly Distribution by ID.
 */
export async function getMonthlyDistribution(db: any, id: string) {
  const rows = await db.select().from(monthlyDistribution).where(eq(monthlyDistribution.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Monthly Distribution.
 */
export async function createMonthlyDistribution(db: any, data: unknown) {
  const parsed = MonthlyDistributionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(monthlyDistribution).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Monthly Distribution.
 */
export async function updateMonthlyDistribution(db: any, id: string, data: unknown) {
  const parsed = MonthlyDistributionInsertSchema.partial().parse(data);
  await db.update(monthlyDistribution).set({ ...parsed, modified: new Date() }).where(eq(monthlyDistribution.id, id));
  return getMonthlyDistribution(db, id);
}

/**
 * Delete a Monthly Distribution by ID.
 */
export async function deleteMonthlyDistribution(db: any, id: string) {
  await db.delete(monthlyDistribution).where(eq(monthlyDistribution.id, id));
  return { deleted: true, id };
}
