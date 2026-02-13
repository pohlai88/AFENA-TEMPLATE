// CRUD API handlers for Process Subscription
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { processSubscription } from '../db/schema.js';
import { ProcessSubscriptionSchema, ProcessSubscriptionInsertSchema } from '../types/process-subscription.js';

export const ROUTE_PREFIX = '/process-subscription';

/**
 * List Process Subscription records.
 */
export async function listProcessSubscription(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(processSubscription).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Process Subscription by ID.
 */
export async function getProcessSubscription(db: any, id: string) {
  const rows = await db.select().from(processSubscription).where(eq(processSubscription.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Process Subscription.
 */
export async function createProcessSubscription(db: any, data: unknown) {
  const parsed = ProcessSubscriptionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(processSubscription).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Process Subscription.
 */
export async function updateProcessSubscription(db: any, id: string, data: unknown) {
  const parsed = ProcessSubscriptionInsertSchema.partial().parse(data);
  await db.update(processSubscription).set({ ...parsed, modified: new Date() }).where(eq(processSubscription.id, id));
  return getProcessSubscription(db, id);
}

/**
 * Delete a Process Subscription by ID.
 */
export async function deleteProcessSubscription(db: any, id: string) {
  await db.delete(processSubscription).where(eq(processSubscription.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Process Subscription (set docstatus = 1).
 */
export async function submitProcessSubscription(db: any, id: string) {
  await db.update(processSubscription).set({ docstatus: 1, modified: new Date() }).where(eq(processSubscription.id, id));
  return getProcessSubscription(db, id);
}

/**
 * Cancel a Process Subscription (set docstatus = 2).
 */
export async function cancelProcessSubscription(db: any, id: string) {
  await db.update(processSubscription).set({ docstatus: 2, modified: new Date() }).where(eq(processSubscription.id, id));
  return getProcessSubscription(db, id);
}
