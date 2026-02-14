// CRUD API handlers for Pricing Rule Brand
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { pricingRuleBrand } from '../db/schema.js';
import { PricingRuleBrandSchema, PricingRuleBrandInsertSchema } from '../types/pricing-rule-brand.js';

export const ROUTE_PREFIX = '/pricing-rule-brand';

/**
 * List Pricing Rule Brand records.
 */
export async function listPricingRuleBrand(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(pricingRuleBrand).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Pricing Rule Brand by ID.
 */
export async function getPricingRuleBrand(db: any, id: string) {
  const rows = await db.select().from(pricingRuleBrand).where(eq(pricingRuleBrand.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Pricing Rule Brand.
 */
export async function createPricingRuleBrand(db: any, data: unknown) {
  const parsed = PricingRuleBrandInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(pricingRuleBrand).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Pricing Rule Brand.
 */
export async function updatePricingRuleBrand(db: any, id: string, data: unknown) {
  const parsed = PricingRuleBrandInsertSchema.partial().parse(data);
  await db.update(pricingRuleBrand).set({ ...parsed, modified: new Date() }).where(eq(pricingRuleBrand.id, id));
  return getPricingRuleBrand(db, id);
}

/**
 * Delete a Pricing Rule Brand by ID.
 */
export async function deletePricingRuleBrand(db: any, id: string) {
  await db.delete(pricingRuleBrand).where(eq(pricingRuleBrand.id, id));
  return { deleted: true, id };
}
