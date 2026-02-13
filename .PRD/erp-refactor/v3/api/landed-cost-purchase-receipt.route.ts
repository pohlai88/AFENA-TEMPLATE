// CRUD API handlers for Landed Cost Purchase Receipt
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { landedCostPurchaseReceipt } from '../db/schema.js';
import { LandedCostPurchaseReceiptSchema, LandedCostPurchaseReceiptInsertSchema } from '../types/landed-cost-purchase-receipt.js';

export const ROUTE_PREFIX = '/landed-cost-purchase-receipt';

/**
 * List Landed Cost Purchase Receipt records.
 */
export async function listLandedCostPurchaseReceipt(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(landedCostPurchaseReceipt).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Landed Cost Purchase Receipt by ID.
 */
export async function getLandedCostPurchaseReceipt(db: any, id: string) {
  const rows = await db.select().from(landedCostPurchaseReceipt).where(eq(landedCostPurchaseReceipt.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Landed Cost Purchase Receipt.
 */
export async function createLandedCostPurchaseReceipt(db: any, data: unknown) {
  const parsed = LandedCostPurchaseReceiptInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(landedCostPurchaseReceipt).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Landed Cost Purchase Receipt.
 */
export async function updateLandedCostPurchaseReceipt(db: any, id: string, data: unknown) {
  const parsed = LandedCostPurchaseReceiptInsertSchema.partial().parse(data);
  await db.update(landedCostPurchaseReceipt).set({ ...parsed, modified: new Date() }).where(eq(landedCostPurchaseReceipt.id, id));
  return getLandedCostPurchaseReceipt(db, id);
}

/**
 * Delete a Landed Cost Purchase Receipt by ID.
 */
export async function deleteLandedCostPurchaseReceipt(db: any, id: string) {
  await db.delete(landedCostPurchaseReceipt).where(eq(landedCostPurchaseReceipt.id, id));
  return { deleted: true, id };
}
