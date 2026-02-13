// CRUD API handlers for Cashier Closing Payments
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { cashierClosingPayments } from '../db/schema.js';
import { CashierClosingPaymentsSchema, CashierClosingPaymentsInsertSchema } from '../types/cashier-closing-payments.js';

export const ROUTE_PREFIX = '/cashier-closing-payments';

/**
 * List Cashier Closing Payments records.
 */
export async function listCashierClosingPayments(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(cashierClosingPayments).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Cashier Closing Payments by ID.
 */
export async function getCashierClosingPayments(db: any, id: string) {
  const rows = await db.select().from(cashierClosingPayments).where(eq(cashierClosingPayments.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Cashier Closing Payments.
 */
export async function createCashierClosingPayments(db: any, data: unknown) {
  const parsed = CashierClosingPaymentsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(cashierClosingPayments).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Cashier Closing Payments.
 */
export async function updateCashierClosingPayments(db: any, id: string, data: unknown) {
  const parsed = CashierClosingPaymentsInsertSchema.partial().parse(data);
  await db.update(cashierClosingPayments).set({ ...parsed, modified: new Date() }).where(eq(cashierClosingPayments.id, id));
  return getCashierClosingPayments(db, id);
}

/**
 * Delete a Cashier Closing Payments by ID.
 */
export async function deleteCashierClosingPayments(db: any, id: string) {
  await db.delete(cashierClosingPayments).where(eq(cashierClosingPayments.id, id));
  return { deleted: true, id };
}
