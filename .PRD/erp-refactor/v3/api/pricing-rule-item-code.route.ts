// CRUD API handlers for Pricing Rule Item Code
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { pricingRuleItemCode } from '../db/schema.js';
import { PricingRuleItemCodeSchema, PricingRuleItemCodeInsertSchema } from '../types/pricing-rule-item-code.js';

export const ROUTE_PREFIX = '/pricing-rule-item-code';

/**
 * List Pricing Rule Item Code records.
 */
export async function listPricingRuleItemCode(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(pricingRuleItemCode).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Pricing Rule Item Code by ID.
 */
export async function getPricingRuleItemCode(db: any, id: string) {
  const rows = await db.select().from(pricingRuleItemCode).where(eq(pricingRuleItemCode.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Pricing Rule Item Code.
 */
export async function createPricingRuleItemCode(db: any, data: unknown) {
  const parsed = PricingRuleItemCodeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(pricingRuleItemCode).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Pricing Rule Item Code.
 */
export async function updatePricingRuleItemCode(db: any, id: string, data: unknown) {
  const parsed = PricingRuleItemCodeInsertSchema.partial().parse(data);
  await db.update(pricingRuleItemCode).set({ ...parsed, modified: new Date() }).where(eq(pricingRuleItemCode.id, id));
  return getPricingRuleItemCode(db, id);
}

/**
 * Delete a Pricing Rule Item Code by ID.
 */
export async function deletePricingRuleItemCode(db: any, id: string) {
  await db.delete(pricingRuleItemCode).where(eq(pricingRuleItemCode.id, id));
  return { deleted: true, id };
}
