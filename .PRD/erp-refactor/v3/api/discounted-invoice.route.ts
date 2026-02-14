// CRUD API handlers for Discounted Invoice
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { discountedInvoice } from '../db/schema.js';
import { DiscountedInvoiceSchema, DiscountedInvoiceInsertSchema } from '../types/discounted-invoice.js';

export const ROUTE_PREFIX = '/discounted-invoice';

/**
 * List Discounted Invoice records.
 */
export async function listDiscountedInvoice(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(discountedInvoice).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Discounted Invoice by ID.
 */
export async function getDiscountedInvoice(db: any, id: string) {
  const rows = await db.select().from(discountedInvoice).where(eq(discountedInvoice.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Discounted Invoice.
 */
export async function createDiscountedInvoice(db: any, data: unknown) {
  const parsed = DiscountedInvoiceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(discountedInvoice).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Discounted Invoice.
 */
export async function updateDiscountedInvoice(db: any, id: string, data: unknown) {
  const parsed = DiscountedInvoiceInsertSchema.partial().parse(data);
  await db.update(discountedInvoice).set({ ...parsed, modified: new Date() }).where(eq(discountedInvoice.id, id));
  return getDiscountedInvoice(db, id);
}

/**
 * Delete a Discounted Invoice by ID.
 */
export async function deleteDiscountedInvoice(db: any, id: string) {
  await db.delete(discountedInvoice).where(eq(discountedInvoice.id, id));
  return { deleted: true, id };
}
