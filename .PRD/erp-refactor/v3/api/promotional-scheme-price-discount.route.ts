// CRUD API handlers for Promotional Scheme Price Discount
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { promotionalSchemePriceDiscount } from '../db/schema.js';
import { PromotionalSchemePriceDiscountSchema, PromotionalSchemePriceDiscountInsertSchema } from '../types/promotional-scheme-price-discount.js';

export const ROUTE_PREFIX = '/promotional-scheme-price-discount';

/**
 * List Promotional Scheme Price Discount records.
 */
export async function listPromotionalSchemePriceDiscount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(promotionalSchemePriceDiscount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Promotional Scheme Price Discount by ID.
 */
export async function getPromotionalSchemePriceDiscount(db: any, id: string) {
  const rows = await db.select().from(promotionalSchemePriceDiscount).where(eq(promotionalSchemePriceDiscount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Promotional Scheme Price Discount.
 */
export async function createPromotionalSchemePriceDiscount(db: any, data: unknown) {
  const parsed = PromotionalSchemePriceDiscountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(promotionalSchemePriceDiscount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Promotional Scheme Price Discount.
 */
export async function updatePromotionalSchemePriceDiscount(db: any, id: string, data: unknown) {
  const parsed = PromotionalSchemePriceDiscountInsertSchema.partial().parse(data);
  await db.update(promotionalSchemePriceDiscount).set({ ...parsed, modified: new Date() }).where(eq(promotionalSchemePriceDiscount.id, id));
  return getPromotionalSchemePriceDiscount(db, id);
}

/**
 * Delete a Promotional Scheme Price Discount by ID.
 */
export async function deletePromotionalSchemePriceDiscount(db: any, id: string) {
  await db.delete(promotionalSchemePriceDiscount).where(eq(promotionalSchemePriceDiscount.id, id));
  return { deleted: true, id };
}
