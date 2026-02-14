// CRUD API handlers for Subscription Invoice
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subscriptionInvoice } from '../db/schema.js';
import { SubscriptionInvoiceSchema, SubscriptionInvoiceInsertSchema } from '../types/subscription-invoice.js';

export const ROUTE_PREFIX = '/subscription-invoice';

/**
 * List Subscription Invoice records.
 */
export async function listSubscriptionInvoice(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subscriptionInvoice).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subscription Invoice by ID.
 */
export async function getSubscriptionInvoice(db: any, id: string) {
  const rows = await db.select().from(subscriptionInvoice).where(eq(subscriptionInvoice.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subscription Invoice.
 */
export async function createSubscriptionInvoice(db: any, data: unknown) {
  const parsed = SubscriptionInvoiceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subscriptionInvoice).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subscription Invoice.
 */
export async function updateSubscriptionInvoice(db: any, id: string, data: unknown) {
  const parsed = SubscriptionInvoiceInsertSchema.partial().parse(data);
  await db.update(subscriptionInvoice).set({ ...parsed, modified: new Date() }).where(eq(subscriptionInvoice.id, id));
  return getSubscriptionInvoice(db, id);
}

/**
 * Delete a Subscription Invoice by ID.
 */
export async function deleteSubscriptionInvoice(db: any, id: string) {
  await db.delete(subscriptionInvoice).where(eq(subscriptionInvoice.id, id));
  return { deleted: true, id };
}
