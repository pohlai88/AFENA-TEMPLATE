// CRUD API handlers for Currency Exchange Settings Details
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { currencyExchangeSettingsDetails } from '../db/schema.js';
import { CurrencyExchangeSettingsDetailsSchema, CurrencyExchangeSettingsDetailsInsertSchema } from '../types/currency-exchange-settings-details.js';

export const ROUTE_PREFIX = '/currency-exchange-settings-details';

/**
 * List Currency Exchange Settings Details records.
 */
export async function listCurrencyExchangeSettingsDetails(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(currencyExchangeSettingsDetails).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Currency Exchange Settings Details by ID.
 */
export async function getCurrencyExchangeSettingsDetails(db: any, id: string) {
  const rows = await db.select().from(currencyExchangeSettingsDetails).where(eq(currencyExchangeSettingsDetails.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Currency Exchange Settings Details.
 */
export async function createCurrencyExchangeSettingsDetails(db: any, data: unknown) {
  const parsed = CurrencyExchangeSettingsDetailsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(currencyExchangeSettingsDetails).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Currency Exchange Settings Details.
 */
export async function updateCurrencyExchangeSettingsDetails(db: any, id: string, data: unknown) {
  const parsed = CurrencyExchangeSettingsDetailsInsertSchema.partial().parse(data);
  await db.update(currencyExchangeSettingsDetails).set({ ...parsed, modified: new Date() }).where(eq(currencyExchangeSettingsDetails.id, id));
  return getCurrencyExchangeSettingsDetails(db, id);
}

/**
 * Delete a Currency Exchange Settings Details by ID.
 */
export async function deleteCurrencyExchangeSettingsDetails(db: any, id: string) {
  await db.delete(currencyExchangeSettingsDetails).where(eq(currencyExchangeSettingsDetails.id, id));
  return { deleted: true, id };
}
