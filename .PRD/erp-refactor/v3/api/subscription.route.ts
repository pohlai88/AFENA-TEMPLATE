// CRUD API handlers for Subscription
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subscription } from '../db/schema.js';
import { SubscriptionSchema, SubscriptionInsertSchema } from '../types/subscription.js';

export const ROUTE_PREFIX = '/subscription';

/**
 * List Subscription records.
 */
export async function listSubscription(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subscription).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subscription by ID.
 */
export async function getSubscription(db: any, id: string) {
  const rows = await db.select().from(subscription).where(eq(subscription.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subscription.
 */
export async function createSubscription(db: any, data: unknown) {
  const parsed = SubscriptionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subscription).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subscription.
 */
export async function updateSubscription(db: any, id: string, data: unknown) {
  const parsed = SubscriptionInsertSchema.partial().parse(data);
  await db.update(subscription).set({ ...parsed, modified: new Date() }).where(eq(subscription.id, id));
  return getSubscription(db, id);
}

/**
 * Delete a Subscription by ID.
 */
export async function deleteSubscription(db: any, id: string) {
  await db.delete(subscription).where(eq(subscription.id, id));
  return { deleted: true, id };
}
