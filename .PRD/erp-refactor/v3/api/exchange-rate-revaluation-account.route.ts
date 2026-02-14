// CRUD API handlers for Exchange Rate Revaluation Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { exchangeRateRevaluationAccount } from '../db/schema.js';
import { ExchangeRateRevaluationAccountSchema, ExchangeRateRevaluationAccountInsertSchema } from '../types/exchange-rate-revaluation-account.js';

export const ROUTE_PREFIX = '/exchange-rate-revaluation-account';

/**
 * List Exchange Rate Revaluation Account records.
 */
export async function listExchangeRateRevaluationAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(exchangeRateRevaluationAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Exchange Rate Revaluation Account by ID.
 */
export async function getExchangeRateRevaluationAccount(db: any, id: string) {
  const rows = await db.select().from(exchangeRateRevaluationAccount).where(eq(exchangeRateRevaluationAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Exchange Rate Revaluation Account.
 */
export async function createExchangeRateRevaluationAccount(db: any, data: unknown) {
  const parsed = ExchangeRateRevaluationAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(exchangeRateRevaluationAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Exchange Rate Revaluation Account.
 */
export async function updateExchangeRateRevaluationAccount(db: any, id: string, data: unknown) {
  const parsed = ExchangeRateRevaluationAccountInsertSchema.partial().parse(data);
  await db.update(exchangeRateRevaluationAccount).set({ ...parsed, modified: new Date() }).where(eq(exchangeRateRevaluationAccount.id, id));
  return getExchangeRateRevaluationAccount(db, id);
}

/**
 * Delete a Exchange Rate Revaluation Account by ID.
 */
export async function deleteExchangeRateRevaluationAccount(db: any, id: string) {
  await db.delete(exchangeRateRevaluationAccount).where(eq(exchangeRateRevaluationAccount.id, id));
  return { deleted: true, id };
}
