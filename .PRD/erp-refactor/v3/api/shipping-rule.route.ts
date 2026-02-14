// CRUD API handlers for Shipping Rule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shippingRule } from '../db/schema.js';
import { ShippingRuleSchema, ShippingRuleInsertSchema } from '../types/shipping-rule.js';

export const ROUTE_PREFIX = '/shipping-rule';

/**
 * List Shipping Rule records.
 */
export async function listShippingRule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shippingRule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Shipping Rule by ID.
 */
export async function getShippingRule(db: any, id: string) {
  const rows = await db.select().from(shippingRule).where(eq(shippingRule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Shipping Rule.
 */
export async function createShippingRule(db: any, data: unknown) {
  const parsed = ShippingRuleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shippingRule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Shipping Rule.
 */
export async function updateShippingRule(db: any, id: string, data: unknown) {
  const parsed = ShippingRuleInsertSchema.partial().parse(data);
  await db.update(shippingRule).set({ ...parsed, modified: new Date() }).where(eq(shippingRule.id, id));
  return getShippingRule(db, id);
}

/**
 * Delete a Shipping Rule by ID.
 */
export async function deleteShippingRule(db: any, id: string) {
  await db.delete(shippingRule).where(eq(shippingRule.id, id));
  return { deleted: true, id };
}
