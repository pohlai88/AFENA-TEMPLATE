// CRUD API handlers for Overdue Payment
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { overduePayment } from '../db/schema.js';
import { OverduePaymentSchema, OverduePaymentInsertSchema } from '../types/overdue-payment.js';

export const ROUTE_PREFIX = '/overdue-payment';

/**
 * List Overdue Payment records.
 */
export async function listOverduePayment(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(overduePayment).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Overdue Payment by ID.
 */
export async function getOverduePayment(db: any, id: string) {
  const rows = await db.select().from(overduePayment).where(eq(overduePayment.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Overdue Payment.
 */
export async function createOverduePayment(db: any, data: unknown) {
  const parsed = OverduePaymentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(overduePayment).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Overdue Payment.
 */
export async function updateOverduePayment(db: any, id: string, data: unknown) {
  const parsed = OverduePaymentInsertSchema.partial().parse(data);
  await db.update(overduePayment).set({ ...parsed, modified: new Date() }).where(eq(overduePayment.id, id));
  return getOverduePayment(db, id);
}

/**
 * Delete a Overdue Payment by ID.
 */
export async function deleteOverduePayment(db: any, id: string) {
  await db.delete(overduePayment).where(eq(overduePayment.id, id));
  return { deleted: true, id };
}
