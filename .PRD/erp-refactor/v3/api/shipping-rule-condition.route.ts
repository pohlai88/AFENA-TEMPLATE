// CRUD API handlers for Shipping Rule Condition
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shippingRuleCondition } from '../db/schema.js';
import { ShippingRuleConditionSchema, ShippingRuleConditionInsertSchema } from '../types/shipping-rule-condition.js';

export const ROUTE_PREFIX = '/shipping-rule-condition';

/**
 * List Shipping Rule Condition records.
 */
export async function listShippingRuleCondition(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shippingRuleCondition).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Shipping Rule Condition by ID.
 */
export async function getShippingRuleCondition(db: any, id: string) {
  const rows = await db.select().from(shippingRuleCondition).where(eq(shippingRuleCondition.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Shipping Rule Condition.
 */
export async function createShippingRuleCondition(db: any, data: unknown) {
  const parsed = ShippingRuleConditionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shippingRuleCondition).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Shipping Rule Condition.
 */
export async function updateShippingRuleCondition(db: any, id: string, data: unknown) {
  const parsed = ShippingRuleConditionInsertSchema.partial().parse(data);
  await db.update(shippingRuleCondition).set({ ...parsed, modified: new Date() }).where(eq(shippingRuleCondition.id, id));
  return getShippingRuleCondition(db, id);
}

/**
 * Delete a Shipping Rule Condition by ID.
 */
export async function deleteShippingRuleCondition(db: any, id: string) {
  await db.delete(shippingRuleCondition).where(eq(shippingRuleCondition.id, id));
  return { deleted: true, id };
}
