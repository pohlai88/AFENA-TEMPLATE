// CRUD API handlers for Subscription Plan
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subscriptionPlan } from '../db/schema.js';
import { SubscriptionPlanSchema, SubscriptionPlanInsertSchema } from '../types/subscription-plan.js';

export const ROUTE_PREFIX = '/subscription-plan';

/**
 * List Subscription Plan records.
 */
export async function listSubscriptionPlan(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subscriptionPlan).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subscription Plan by ID.
 */
export async function getSubscriptionPlan(db: any, id: string) {
  const rows = await db.select().from(subscriptionPlan).where(eq(subscriptionPlan.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subscription Plan.
 */
export async function createSubscriptionPlan(db: any, data: unknown) {
  const parsed = SubscriptionPlanInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subscriptionPlan).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subscription Plan.
 */
export async function updateSubscriptionPlan(db: any, id: string, data: unknown) {
  const parsed = SubscriptionPlanInsertSchema.partial().parse(data);
  await db.update(subscriptionPlan).set({ ...parsed, modified: new Date() }).where(eq(subscriptionPlan.id, id));
  return getSubscriptionPlan(db, id);
}

/**
 * Delete a Subscription Plan by ID.
 */
export async function deleteSubscriptionPlan(db: any, id: string) {
  await db.delete(subscriptionPlan).where(eq(subscriptionPlan.id, id));
  return { deleted: true, id };
}
