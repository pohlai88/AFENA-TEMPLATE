// CRUD API handlers for Sales Stage
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesStage } from '../db/schema.js';
import { SalesStageSchema, SalesStageInsertSchema } from '../types/sales-stage.js';

export const ROUTE_PREFIX = '/sales-stage';

/**
 * List Sales Stage records.
 */
export async function listSalesStage(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesStage).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Stage by ID.
 */
export async function getSalesStage(db: any, id: string) {
  const rows = await db.select().from(salesStage).where(eq(salesStage.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Stage.
 */
export async function createSalesStage(db: any, data: unknown) {
  const parsed = SalesStageInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesStage).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Stage.
 */
export async function updateSalesStage(db: any, id: string, data: unknown) {
  const parsed = SalesStageInsertSchema.partial().parse(data);
  await db.update(salesStage).set({ ...parsed, modified: new Date() }).where(eq(salesStage.id, id));
  return getSalesStage(db, id);
}

/**
 * Delete a Sales Stage by ID.
 */
export async function deleteSalesStage(db: any, id: string) {
  await db.delete(salesStage).where(eq(salesStage.id, id));
  return { deleted: true, id };
}
