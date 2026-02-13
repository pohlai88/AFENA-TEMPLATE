// CRUD API handlers for Exchange Rate Revaluation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { exchangeRateRevaluation } from '../db/schema.js';
import { ExchangeRateRevaluationSchema, ExchangeRateRevaluationInsertSchema } from '../types/exchange-rate-revaluation.js';

export const ROUTE_PREFIX = '/exchange-rate-revaluation';

/**
 * List Exchange Rate Revaluation records.
 */
export async function listExchangeRateRevaluation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(exchangeRateRevaluation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Exchange Rate Revaluation by ID.
 */
export async function getExchangeRateRevaluation(db: any, id: string) {
  const rows = await db.select().from(exchangeRateRevaluation).where(eq(exchangeRateRevaluation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Exchange Rate Revaluation.
 */
export async function createExchangeRateRevaluation(db: any, data: unknown) {
  const parsed = ExchangeRateRevaluationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(exchangeRateRevaluation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Exchange Rate Revaluation.
 */
export async function updateExchangeRateRevaluation(db: any, id: string, data: unknown) {
  const parsed = ExchangeRateRevaluationInsertSchema.partial().parse(data);
  await db.update(exchangeRateRevaluation).set({ ...parsed, modified: new Date() }).where(eq(exchangeRateRevaluation.id, id));
  return getExchangeRateRevaluation(db, id);
}

/**
 * Delete a Exchange Rate Revaluation by ID.
 */
export async function deleteExchangeRateRevaluation(db: any, id: string) {
  await db.delete(exchangeRateRevaluation).where(eq(exchangeRateRevaluation.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Exchange Rate Revaluation (set docstatus = 1).
 */
export async function submitExchangeRateRevaluation(db: any, id: string) {
  await db.update(exchangeRateRevaluation).set({ docstatus: 1, modified: new Date() }).where(eq(exchangeRateRevaluation.id, id));
  return getExchangeRateRevaluation(db, id);
}

/**
 * Cancel a Exchange Rate Revaluation (set docstatus = 2).
 */
export async function cancelExchangeRateRevaluation(db: any, id: string) {
  await db.update(exchangeRateRevaluation).set({ docstatus: 2, modified: new Date() }).where(eq(exchangeRateRevaluation.id, id));
  return getExchangeRateRevaluation(db, id);
}
