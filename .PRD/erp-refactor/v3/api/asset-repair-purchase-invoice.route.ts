// CRUD API handlers for Asset Repair Purchase Invoice
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetRepairPurchaseInvoice } from '../db/schema.js';
import { AssetRepairPurchaseInvoiceSchema, AssetRepairPurchaseInvoiceInsertSchema } from '../types/asset-repair-purchase-invoice.js';

export const ROUTE_PREFIX = '/asset-repair-purchase-invoice';

/**
 * List Asset Repair Purchase Invoice records.
 */
export async function listAssetRepairPurchaseInvoice(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetRepairPurchaseInvoice).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Repair Purchase Invoice by ID.
 */
export async function getAssetRepairPurchaseInvoice(db: any, id: string) {
  const rows = await db.select().from(assetRepairPurchaseInvoice).where(eq(assetRepairPurchaseInvoice.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Repair Purchase Invoice.
 */
export async function createAssetRepairPurchaseInvoice(db: any, data: unknown) {
  const parsed = AssetRepairPurchaseInvoiceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetRepairPurchaseInvoice).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Repair Purchase Invoice.
 */
export async function updateAssetRepairPurchaseInvoice(db: any, id: string, data: unknown) {
  const parsed = AssetRepairPurchaseInvoiceInsertSchema.partial().parse(data);
  await db.update(assetRepairPurchaseInvoice).set({ ...parsed, modified: new Date() }).where(eq(assetRepairPurchaseInvoice.id, id));
  return getAssetRepairPurchaseInvoice(db, id);
}

/**
 * Delete a Asset Repair Purchase Invoice by ID.
 */
export async function deleteAssetRepairPurchaseInvoice(db: any, id: string) {
  await db.delete(assetRepairPurchaseInvoice).where(eq(assetRepairPurchaseInvoice.id, id));
  return { deleted: true, id };
}
