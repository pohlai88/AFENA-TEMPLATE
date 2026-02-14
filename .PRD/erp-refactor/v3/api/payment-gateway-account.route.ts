// CRUD API handlers for Payment Gateway Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentGatewayAccount } from '../db/schema.js';
import { PaymentGatewayAccountSchema, PaymentGatewayAccountInsertSchema } from '../types/payment-gateway-account.js';

export const ROUTE_PREFIX = '/payment-gateway-account';

/**
 * List Payment Gateway Account records.
 */
export async function listPaymentGatewayAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentGatewayAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Gateway Account by ID.
 */
export async function getPaymentGatewayAccount(db: any, id: string) {
  const rows = await db.select().from(paymentGatewayAccount).where(eq(paymentGatewayAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Gateway Account.
 */
export async function createPaymentGatewayAccount(db: any, data: unknown) {
  const parsed = PaymentGatewayAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentGatewayAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Gateway Account.
 */
export async function updatePaymentGatewayAccount(db: any, id: string, data: unknown) {
  const parsed = PaymentGatewayAccountInsertSchema.partial().parse(data);
  await db.update(paymentGatewayAccount).set({ ...parsed, modified: new Date() }).where(eq(paymentGatewayAccount.id, id));
  return getPaymentGatewayAccount(db, id);
}

/**
 * Delete a Payment Gateway Account by ID.
 */
export async function deletePaymentGatewayAccount(db: any, id: string) {
  await db.delete(paymentGatewayAccount).where(eq(paymentGatewayAccount.id, id));
  return { deleted: true, id };
}
