// CRUD API handlers for Shipping Rule Country
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shippingRuleCountry } from '../db/schema.js';
import { ShippingRuleCountrySchema, ShippingRuleCountryInsertSchema } from '../types/shipping-rule-country.js';

export const ROUTE_PREFIX = '/shipping-rule-country';

/**
 * List Shipping Rule Country records.
 */
export async function listShippingRuleCountry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shippingRuleCountry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Shipping Rule Country by ID.
 */
export async function getShippingRuleCountry(db: any, id: string) {
  const rows = await db.select().from(shippingRuleCountry).where(eq(shippingRuleCountry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Shipping Rule Country.
 */
export async function createShippingRuleCountry(db: any, data: unknown) {
  const parsed = ShippingRuleCountryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shippingRuleCountry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Shipping Rule Country.
 */
export async function updateShippingRuleCountry(db: any, id: string, data: unknown) {
  const parsed = ShippingRuleCountryInsertSchema.partial().parse(data);
  await db.update(shippingRuleCountry).set({ ...parsed, modified: new Date() }).where(eq(shippingRuleCountry.id, id));
  return getShippingRuleCountry(db, id);
}

/**
 * Delete a Shipping Rule Country by ID.
 */
export async function deleteShippingRuleCountry(db: any, id: string) {
  await db.delete(shippingRuleCountry).where(eq(shippingRuleCountry.id, id));
  return { deleted: true, id };
}
