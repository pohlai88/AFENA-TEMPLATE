// CRUD API handlers for Customs Tariff Number
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { customsTariffNumber } from '../db/schema.js';
import { CustomsTariffNumberSchema, CustomsTariffNumberInsertSchema } from '../types/customs-tariff-number.js';

export const ROUTE_PREFIX = '/customs-tariff-number';

/**
 * List Customs Tariff Number records.
 */
export async function listCustomsTariffNumber(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(customsTariffNumber).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Customs Tariff Number by ID.
 */
export async function getCustomsTariffNumber(db: any, id: string) {
  const rows = await db.select().from(customsTariffNumber).where(eq(customsTariffNumber.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Customs Tariff Number.
 */
export async function createCustomsTariffNumber(db: any, data: unknown) {
  const parsed = CustomsTariffNumberInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(customsTariffNumber).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Customs Tariff Number.
 */
export async function updateCustomsTariffNumber(db: any, id: string, data: unknown) {
  const parsed = CustomsTariffNumberInsertSchema.partial().parse(data);
  await db.update(customsTariffNumber).set({ ...parsed, modified: new Date() }).where(eq(customsTariffNumber.id, id));
  return getCustomsTariffNumber(db, id);
}

/**
 * Delete a Customs Tariff Number by ID.
 */
export async function deleteCustomsTariffNumber(db: any, id: string) {
  await db.delete(customsTariffNumber).where(eq(customsTariffNumber.id, id));
  return { deleted: true, id };
}
