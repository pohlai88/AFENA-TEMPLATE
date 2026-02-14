// CRUD API handlers for Landed Cost Vendor Invoice
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { landedCostVendorInvoice } from '../db/schema.js';
import { LandedCostVendorInvoiceSchema, LandedCostVendorInvoiceInsertSchema } from '../types/landed-cost-vendor-invoice.js';

export const ROUTE_PREFIX = '/landed-cost-vendor-invoice';

/**
 * List Landed Cost Vendor Invoice records.
 */
export async function listLandedCostVendorInvoice(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(landedCostVendorInvoice).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Landed Cost Vendor Invoice by ID.
 */
export async function getLandedCostVendorInvoice(db: any, id: string) {
  const rows = await db.select().from(landedCostVendorInvoice).where(eq(landedCostVendorInvoice.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Landed Cost Vendor Invoice.
 */
export async function createLandedCostVendorInvoice(db: any, data: unknown) {
  const parsed = LandedCostVendorInvoiceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(landedCostVendorInvoice).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Landed Cost Vendor Invoice.
 */
export async function updateLandedCostVendorInvoice(db: any, id: string, data: unknown) {
  const parsed = LandedCostVendorInvoiceInsertSchema.partial().parse(data);
  await db.update(landedCostVendorInvoice).set({ ...parsed, modified: new Date() }).where(eq(landedCostVendorInvoice.id, id));
  return getLandedCostVendorInvoice(db, id);
}

/**
 * Delete a Landed Cost Vendor Invoice by ID.
 */
export async function deleteLandedCostVendorInvoice(db: any, id: string) {
  await db.delete(landedCostVendorInvoice).where(eq(landedCostVendorInvoice.id, id));
  return { deleted: true, id };
}
