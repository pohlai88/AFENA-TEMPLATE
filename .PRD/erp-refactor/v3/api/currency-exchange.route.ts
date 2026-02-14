// CRUD API handlers for Currency Exchange
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { currencyExchange } from '../db/schema.js';
import { CurrencyExchangeSchema, CurrencyExchangeInsertSchema } from '../types/currency-exchange.js';

export const ROUTE_PREFIX = '/currency-exchange';

/**
 * List Currency Exchange records.
 */
export async function listCurrencyExchange(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(currencyExchange).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Currency Exchange by ID.
 */
export async function getCurrencyExchange(db: any, id: string) {
  const rows = await db.select().from(currencyExchange).where(eq(currencyExchange.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Currency Exchange.
 */
export async function createCurrencyExchange(db: any, data: unknown) {
  const parsed = CurrencyExchangeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(currencyExchange).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Currency Exchange.
 */
export async function updateCurrencyExchange(db: any, id: string, data: unknown) {
  const parsed = CurrencyExchangeInsertSchema.partial().parse(data);
  await db.update(currencyExchange).set({ ...parsed, modified: new Date() }).where(eq(currencyExchange.id, id));
  return getCurrencyExchange(db, id);
}

/**
 * Delete a Currency Exchange by ID.
 */
export async function deleteCurrencyExchange(db: any, id: string) {
  await db.delete(currencyExchange).where(eq(currencyExchange.id, id));
  return { deleted: true, id };
}
