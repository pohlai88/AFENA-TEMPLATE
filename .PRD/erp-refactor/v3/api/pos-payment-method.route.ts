// CRUD API handlers for POS Payment Method
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posPaymentMethod } from '../db/schema.js';
import { PosPaymentMethodSchema, PosPaymentMethodInsertSchema } from '../types/pos-payment-method.js';

export const ROUTE_PREFIX = '/pos-payment-method';

/**
 * List POS Payment Method records.
 */
export async function listPosPaymentMethod(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posPaymentMethod).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Payment Method by ID.
 */
export async function getPosPaymentMethod(db: any, id: string) {
  const rows = await db.select().from(posPaymentMethod).where(eq(posPaymentMethod.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Payment Method.
 */
export async function createPosPaymentMethod(db: any, data: unknown) {
  const parsed = PosPaymentMethodInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posPaymentMethod).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Payment Method.
 */
export async function updatePosPaymentMethod(db: any, id: string, data: unknown) {
  const parsed = PosPaymentMethodInsertSchema.partial().parse(data);
  await db.update(posPaymentMethod).set({ ...parsed, modified: new Date() }).where(eq(posPaymentMethod.id, id));
  return getPosPaymentMethod(db, id);
}

/**
 * Delete a POS Payment Method by ID.
 */
export async function deletePosPaymentMethod(db: any, id: string) {
  await db.delete(posPaymentMethod).where(eq(posPaymentMethod.id, id));
  return { deleted: true, id };
}
