// CRUD API handlers for Mode of Payment
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { modeOfPayment } from '../db/schema.js';
import { ModeOfPaymentSchema, ModeOfPaymentInsertSchema } from '../types/mode-of-payment.js';

export const ROUTE_PREFIX = '/mode-of-payment';

/**
 * List Mode of Payment records.
 */
export async function listModeOfPayment(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(modeOfPayment).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Mode of Payment by ID.
 */
export async function getModeOfPayment(db: any, id: string) {
  const rows = await db.select().from(modeOfPayment).where(eq(modeOfPayment.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Mode of Payment.
 */
export async function createModeOfPayment(db: any, data: unknown) {
  const parsed = ModeOfPaymentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(modeOfPayment).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Mode of Payment.
 */
export async function updateModeOfPayment(db: any, id: string, data: unknown) {
  const parsed = ModeOfPaymentInsertSchema.partial().parse(data);
  await db.update(modeOfPayment).set({ ...parsed, modified: new Date() }).where(eq(modeOfPayment.id, id));
  return getModeOfPayment(db, id);
}

/**
 * Delete a Mode of Payment by ID.
 */
export async function deleteModeOfPayment(db: any, id: string) {
  await db.delete(modeOfPayment).where(eq(modeOfPayment.id, id));
  return { deleted: true, id };
}
