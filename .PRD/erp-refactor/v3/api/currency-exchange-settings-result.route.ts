// CRUD API handlers for Currency Exchange Settings Result
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { currencyExchangeSettingsResult } from '../db/schema.js';
import { CurrencyExchangeSettingsResultSchema, CurrencyExchangeSettingsResultInsertSchema } from '../types/currency-exchange-settings-result.js';

export const ROUTE_PREFIX = '/currency-exchange-settings-result';

/**
 * List Currency Exchange Settings Result records.
 */
export async function listCurrencyExchangeSettingsResult(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(currencyExchangeSettingsResult).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Currency Exchange Settings Result by ID.
 */
export async function getCurrencyExchangeSettingsResult(db: any, id: string) {
  const rows = await db.select().from(currencyExchangeSettingsResult).where(eq(currencyExchangeSettingsResult.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Currency Exchange Settings Result.
 */
export async function createCurrencyExchangeSettingsResult(db: any, data: unknown) {
  const parsed = CurrencyExchangeSettingsResultInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(currencyExchangeSettingsResult).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Currency Exchange Settings Result.
 */
export async function updateCurrencyExchangeSettingsResult(db: any, id: string, data: unknown) {
  const parsed = CurrencyExchangeSettingsResultInsertSchema.partial().parse(data);
  await db.update(currencyExchangeSettingsResult).set({ ...parsed, modified: new Date() }).where(eq(currencyExchangeSettingsResult.id, id));
  return getCurrencyExchangeSettingsResult(db, id);
}

/**
 * Delete a Currency Exchange Settings Result by ID.
 */
export async function deleteCurrencyExchangeSettingsResult(db: any, id: string) {
  await db.delete(currencyExchangeSettingsResult).where(eq(currencyExchangeSettingsResult.id, id));
  return { deleted: true, id };
}
