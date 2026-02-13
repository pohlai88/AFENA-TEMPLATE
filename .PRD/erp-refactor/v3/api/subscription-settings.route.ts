// CRUD API handlers for Subscription Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subscriptionSettings } from '../db/schema.js';
import { SubscriptionSettingsSchema, SubscriptionSettingsInsertSchema } from '../types/subscription-settings.js';

export const ROUTE_PREFIX = '/subscription-settings';

/**
 * List Subscription Settings records.
 */
export async function listSubscriptionSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subscriptionSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subscription Settings by ID.
 */
export async function getSubscriptionSettings(db: any, id: string) {
  const rows = await db.select().from(subscriptionSettings).where(eq(subscriptionSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subscription Settings.
 */
export async function createSubscriptionSettings(db: any, data: unknown) {
  const parsed = SubscriptionSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subscriptionSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subscription Settings.
 */
export async function updateSubscriptionSettings(db: any, id: string, data: unknown) {
  const parsed = SubscriptionSettingsInsertSchema.partial().parse(data);
  await db.update(subscriptionSettings).set({ ...parsed, modified: new Date() }).where(eq(subscriptionSettings.id, id));
  return getSubscriptionSettings(db, id);
}

/**
 * Delete a Subscription Settings by ID.
 */
export async function deleteSubscriptionSettings(db: any, id: string) {
  await db.delete(subscriptionSettings).where(eq(subscriptionSettings.id, id));
  return { deleted: true, id };
}
