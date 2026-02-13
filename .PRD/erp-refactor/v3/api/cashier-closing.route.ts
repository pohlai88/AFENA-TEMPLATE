// CRUD API handlers for Cashier Closing
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { cashierClosing } from '../db/schema.js';
import { CashierClosingSchema, CashierClosingInsertSchema } from '../types/cashier-closing.js';

export const ROUTE_PREFIX = '/cashier-closing';

/**
 * List Cashier Closing records.
 */
export async function listCashierClosing(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(cashierClosing).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Cashier Closing by ID.
 */
export async function getCashierClosing(db: any, id: string) {
  const rows = await db.select().from(cashierClosing).where(eq(cashierClosing.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Cashier Closing.
 */
export async function createCashierClosing(db: any, data: unknown) {
  const parsed = CashierClosingInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(cashierClosing).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Cashier Closing.
 */
export async function updateCashierClosing(db: any, id: string, data: unknown) {
  const parsed = CashierClosingInsertSchema.partial().parse(data);
  await db.update(cashierClosing).set({ ...parsed, modified: new Date() }).where(eq(cashierClosing.id, id));
  return getCashierClosing(db, id);
}

/**
 * Delete a Cashier Closing by ID.
 */
export async function deleteCashierClosing(db: any, id: string) {
  await db.delete(cashierClosing).where(eq(cashierClosing.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Cashier Closing (set docstatus = 1).
 */
export async function submitCashierClosing(db: any, id: string) {
  await db.update(cashierClosing).set({ docstatus: 1, modified: new Date() }).where(eq(cashierClosing.id, id));
  return getCashierClosing(db, id);
}

/**
 * Cancel a Cashier Closing (set docstatus = 2).
 */
export async function cancelCashierClosing(db: any, id: string) {
  await db.update(cashierClosing).set({ docstatus: 2, modified: new Date() }).where(eq(cashierClosing.id, id));
  return getCashierClosing(db, id);
}
