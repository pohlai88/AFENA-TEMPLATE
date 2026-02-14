// CRUD API handlers for Pricing Rule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { pricingRule } from '../db/schema.js';
import { PricingRuleSchema, PricingRuleInsertSchema } from '../types/pricing-rule.js';

export const ROUTE_PREFIX = '/pricing-rule';

/**
 * List Pricing Rule records.
 */
export async function listPricingRule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(pricingRule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Pricing Rule by ID.
 */
export async function getPricingRule(db: any, id: string) {
  const rows = await db.select().from(pricingRule).where(eq(pricingRule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Pricing Rule.
 */
export async function createPricingRule(db: any, data: unknown) {
  const parsed = PricingRuleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(pricingRule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Pricing Rule.
 */
export async function updatePricingRule(db: any, id: string, data: unknown) {
  const parsed = PricingRuleInsertSchema.partial().parse(data);
  await db.update(pricingRule).set({ ...parsed, modified: new Date() }).where(eq(pricingRule.id, id));
  return getPricingRule(db, id);
}

/**
 * Delete a Pricing Rule by ID.
 */
export async function deletePricingRule(db: any, id: string) {
  await db.delete(pricingRule).where(eq(pricingRule.id, id));
  return { deleted: true, id };
}
