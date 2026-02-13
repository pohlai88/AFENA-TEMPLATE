// CRUD API handlers for Pricing Rule Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { pricingRuleDetail } from '../db/schema.js';
import { PricingRuleDetailSchema, PricingRuleDetailInsertSchema } from '../types/pricing-rule-detail.js';

export const ROUTE_PREFIX = '/pricing-rule-detail';

/**
 * List Pricing Rule Detail records.
 */
export async function listPricingRuleDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(pricingRuleDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Pricing Rule Detail by ID.
 */
export async function getPricingRuleDetail(db: any, id: string) {
  const rows = await db.select().from(pricingRuleDetail).where(eq(pricingRuleDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Pricing Rule Detail.
 */
export async function createPricingRuleDetail(db: any, data: unknown) {
  const parsed = PricingRuleDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(pricingRuleDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Pricing Rule Detail.
 */
export async function updatePricingRuleDetail(db: any, id: string, data: unknown) {
  const parsed = PricingRuleDetailInsertSchema.partial().parse(data);
  await db.update(pricingRuleDetail).set({ ...parsed, modified: new Date() }).where(eq(pricingRuleDetail.id, id));
  return getPricingRuleDetail(db, id);
}

/**
 * Delete a Pricing Rule Detail by ID.
 */
export async function deletePricingRuleDetail(db: any, id: string) {
  await db.delete(pricingRuleDetail).where(eq(pricingRuleDetail.id, id));
  return { deleted: true, id };
}
