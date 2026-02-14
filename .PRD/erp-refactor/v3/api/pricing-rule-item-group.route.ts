// CRUD API handlers for Pricing Rule Item Group
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { pricingRuleItemGroup } from '../db/schema.js';
import { PricingRuleItemGroupSchema, PricingRuleItemGroupInsertSchema } from '../types/pricing-rule-item-group.js';

export const ROUTE_PREFIX = '/pricing-rule-item-group';

/**
 * List Pricing Rule Item Group records.
 */
export async function listPricingRuleItemGroup(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(pricingRuleItemGroup).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Pricing Rule Item Group by ID.
 */
export async function getPricingRuleItemGroup(db: any, id: string) {
  const rows = await db.select().from(pricingRuleItemGroup).where(eq(pricingRuleItemGroup.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Pricing Rule Item Group.
 */
export async function createPricingRuleItemGroup(db: any, data: unknown) {
  const parsed = PricingRuleItemGroupInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(pricingRuleItemGroup).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Pricing Rule Item Group.
 */
export async function updatePricingRuleItemGroup(db: any, id: string, data: unknown) {
  const parsed = PricingRuleItemGroupInsertSchema.partial().parse(data);
  await db.update(pricingRuleItemGroup).set({ ...parsed, modified: new Date() }).where(eq(pricingRuleItemGroup.id, id));
  return getPricingRuleItemGroup(db, id);
}

/**
 * Delete a Pricing Rule Item Group by ID.
 */
export async function deletePricingRuleItemGroup(db: any, id: string) {
  await db.delete(pricingRuleItemGroup).where(eq(pricingRuleItemGroup.id, id));
  return { deleted: true, id };
}
