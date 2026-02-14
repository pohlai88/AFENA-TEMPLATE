// CRUD API handlers for Promotional Scheme Product Discount
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { promotionalSchemeProductDiscount } from '../db/schema.js';
import { PromotionalSchemeProductDiscountSchema, PromotionalSchemeProductDiscountInsertSchema } from '../types/promotional-scheme-product-discount.js';

export const ROUTE_PREFIX = '/promotional-scheme-product-discount';

/**
 * List Promotional Scheme Product Discount records.
 */
export async function listPromotionalSchemeProductDiscount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(promotionalSchemeProductDiscount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Promotional Scheme Product Discount by ID.
 */
export async function getPromotionalSchemeProductDiscount(db: any, id: string) {
  const rows = await db.select().from(promotionalSchemeProductDiscount).where(eq(promotionalSchemeProductDiscount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Promotional Scheme Product Discount.
 */
export async function createPromotionalSchemeProductDiscount(db: any, data: unknown) {
  const parsed = PromotionalSchemeProductDiscountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(promotionalSchemeProductDiscount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Promotional Scheme Product Discount.
 */
export async function updatePromotionalSchemeProductDiscount(db: any, id: string, data: unknown) {
  const parsed = PromotionalSchemeProductDiscountInsertSchema.partial().parse(data);
  await db.update(promotionalSchemeProductDiscount).set({ ...parsed, modified: new Date() }).where(eq(promotionalSchemeProductDiscount.id, id));
  return getPromotionalSchemeProductDiscount(db, id);
}

/**
 * Delete a Promotional Scheme Product Discount by ID.
 */
export async function deletePromotionalSchemeProductDiscount(db: any, id: string) {
  await db.delete(promotionalSchemeProductDiscount).where(eq(promotionalSchemeProductDiscount.id, id));
  return { deleted: true, id };
}
