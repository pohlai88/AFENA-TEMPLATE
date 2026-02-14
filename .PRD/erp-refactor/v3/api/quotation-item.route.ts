// CRUD API handlers for Quotation Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { quotationItem } from '../db/schema.js';
import { QuotationItemSchema, QuotationItemInsertSchema } from '../types/quotation-item.js';

export const ROUTE_PREFIX = '/quotation-item';

/**
 * List Quotation Item records.
 */
export async function listQuotationItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(quotationItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quotation Item by ID.
 */
export async function getQuotationItem(db: any, id: string) {
  const rows = await db.select().from(quotationItem).where(eq(quotationItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quotation Item.
 */
export async function createQuotationItem(db: any, data: unknown) {
  const parsed = QuotationItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(quotationItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quotation Item.
 */
export async function updateQuotationItem(db: any, id: string, data: unknown) {
  const parsed = QuotationItemInsertSchema.partial().parse(data);
  await db.update(quotationItem).set({ ...parsed, modified: new Date() }).where(eq(quotationItem.id, id));
  return getQuotationItem(db, id);
}

/**
 * Delete a Quotation Item by ID.
 */
export async function deleteQuotationItem(db: any, id: string) {
  await db.delete(quotationItem).where(eq(quotationItem.id, id));
  return { deleted: true, id };
}
