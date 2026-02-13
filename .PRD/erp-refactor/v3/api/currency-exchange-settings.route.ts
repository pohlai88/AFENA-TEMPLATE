// CRUD API handlers for Currency Exchange Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { currencyExchangeSettings } from '../db/schema.js';
import { CurrencyExchangeSettingsSchema, CurrencyExchangeSettingsInsertSchema } from '../types/currency-exchange-settings.js';

export const ROUTE_PREFIX = '/currency-exchange-settings';

/**
 * List Currency Exchange Settings records.
 */
export async function listCurrencyExchangeSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(currencyExchangeSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Currency Exchange Settings by ID.
 */
export async function getCurrencyExchangeSettings(db: any, id: string) {
  const rows = await db.select().from(currencyExchangeSettings).where(eq(currencyExchangeSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Currency Exchange Settings.
 */
export async function createCurrencyExchangeSettings(db: any, data: unknown) {
  const parsed = CurrencyExchangeSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(currencyExchangeSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Currency Exchange Settings.
 */
export async function updateCurrencyExchangeSettings(db: any, id: string, data: unknown) {
  const parsed = CurrencyExchangeSettingsInsertSchema.partial().parse(data);
  await db.update(currencyExchangeSettings).set({ ...parsed, modified: new Date() }).where(eq(currencyExchangeSettings.id, id));
  return getCurrencyExchangeSettings(db, id);
}

/**
 * Delete a Currency Exchange Settings by ID.
 */
export async function deleteCurrencyExchangeSettings(db: any, id: string) {
  await db.delete(currencyExchangeSettings).where(eq(currencyExchangeSettings.id, id));
  return { deleted: true, id };
}
