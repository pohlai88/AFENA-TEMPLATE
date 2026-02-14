// CRUD API handlers for Unreconcile Payment Entries
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { unreconcilePaymentEntries } from '../db/schema.js';
import { UnreconcilePaymentEntriesSchema, UnreconcilePaymentEntriesInsertSchema } from '../types/unreconcile-payment-entries.js';

export const ROUTE_PREFIX = '/unreconcile-payment-entries';

/**
 * List Unreconcile Payment Entries records.
 */
export async function listUnreconcilePaymentEntries(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(unreconcilePaymentEntries).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Unreconcile Payment Entries by ID.
 */
export async function getUnreconcilePaymentEntries(db: any, id: string) {
  const rows = await db.select().from(unreconcilePaymentEntries).where(eq(unreconcilePaymentEntries.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Unreconcile Payment Entries.
 */
export async function createUnreconcilePaymentEntries(db: any, data: unknown) {
  const parsed = UnreconcilePaymentEntriesInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(unreconcilePaymentEntries).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Unreconcile Payment Entries.
 */
export async function updateUnreconcilePaymentEntries(db: any, id: string, data: unknown) {
  const parsed = UnreconcilePaymentEntriesInsertSchema.partial().parse(data);
  await db.update(unreconcilePaymentEntries).set({ ...parsed, modified: new Date() }).where(eq(unreconcilePaymentEntries.id, id));
  return getUnreconcilePaymentEntries(db, id);
}

/**
 * Delete a Unreconcile Payment Entries by ID.
 */
export async function deleteUnreconcilePaymentEntries(db: any, id: string) {
  await db.delete(unreconcilePaymentEntries).where(eq(unreconcilePaymentEntries.id, id));
  return { deleted: true, id };
}
