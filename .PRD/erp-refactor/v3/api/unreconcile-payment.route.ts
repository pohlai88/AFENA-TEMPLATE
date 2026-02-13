// CRUD API handlers for Unreconcile Payment
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { unreconcilePayment } from '../db/schema.js';
import { UnreconcilePaymentSchema, UnreconcilePaymentInsertSchema } from '../types/unreconcile-payment.js';

export const ROUTE_PREFIX = '/unreconcile-payment';

/**
 * List Unreconcile Payment records.
 */
export async function listUnreconcilePayment(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(unreconcilePayment).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Unreconcile Payment by ID.
 */
export async function getUnreconcilePayment(db: any, id: string) {
  const rows = await db.select().from(unreconcilePayment).where(eq(unreconcilePayment.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Unreconcile Payment.
 */
export async function createUnreconcilePayment(db: any, data: unknown) {
  const parsed = UnreconcilePaymentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(unreconcilePayment).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Unreconcile Payment.
 */
export async function updateUnreconcilePayment(db: any, id: string, data: unknown) {
  const parsed = UnreconcilePaymentInsertSchema.partial().parse(data);
  await db.update(unreconcilePayment).set({ ...parsed, modified: new Date() }).where(eq(unreconcilePayment.id, id));
  return getUnreconcilePayment(db, id);
}

/**
 * Delete a Unreconcile Payment by ID.
 */
export async function deleteUnreconcilePayment(db: any, id: string) {
  await db.delete(unreconcilePayment).where(eq(unreconcilePayment.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Unreconcile Payment (set docstatus = 1).
 */
export async function submitUnreconcilePayment(db: any, id: string) {
  await db.update(unreconcilePayment).set({ docstatus: 1, modified: new Date() }).where(eq(unreconcilePayment.id, id));
  return getUnreconcilePayment(db, id);
}

/**
 * Cancel a Unreconcile Payment (set docstatus = 2).
 */
export async function cancelUnreconcilePayment(db: any, id: string) {
  await db.update(unreconcilePayment).set({ docstatus: 2, modified: new Date() }).where(eq(unreconcilePayment.id, id));
  return getUnreconcilePayment(db, id);
}
