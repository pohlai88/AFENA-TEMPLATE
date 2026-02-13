// CRUD API handlers for Subscription Plan Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subscriptionPlanDetail } from '../db/schema.js';
import { SubscriptionPlanDetailSchema, SubscriptionPlanDetailInsertSchema } from '../types/subscription-plan-detail.js';

export const ROUTE_PREFIX = '/subscription-plan-detail';

/**
 * List Subscription Plan Detail records.
 */
export async function listSubscriptionPlanDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subscriptionPlanDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subscription Plan Detail by ID.
 */
export async function getSubscriptionPlanDetail(db: any, id: string) {
  const rows = await db.select().from(subscriptionPlanDetail).where(eq(subscriptionPlanDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subscription Plan Detail.
 */
export async function createSubscriptionPlanDetail(db: any, data: unknown) {
  const parsed = SubscriptionPlanDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subscriptionPlanDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subscription Plan Detail.
 */
export async function updateSubscriptionPlanDetail(db: any, id: string, data: unknown) {
  const parsed = SubscriptionPlanDetailInsertSchema.partial().parse(data);
  await db.update(subscriptionPlanDetail).set({ ...parsed, modified: new Date() }).where(eq(subscriptionPlanDetail.id, id));
  return getSubscriptionPlanDetail(db, id);
}

/**
 * Delete a Subscription Plan Detail by ID.
 */
export async function deleteSubscriptionPlanDetail(db: any, id: string) {
  await db.delete(subscriptionPlanDetail).where(eq(subscriptionPlanDetail.id, id));
  return { deleted: true, id };
}
