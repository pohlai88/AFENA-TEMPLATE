// CRUD API handlers for Landed Cost Taxes and Charges
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { landedCostTaxesAndCharges } from '../db/schema.js';
import { LandedCostTaxesAndChargesSchema, LandedCostTaxesAndChargesInsertSchema } from '../types/landed-cost-taxes-and-charges.js';

export const ROUTE_PREFIX = '/landed-cost-taxes-and-charges';

/**
 * List Landed Cost Taxes and Charges records.
 */
export async function listLandedCostTaxesAndCharges(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(landedCostTaxesAndCharges).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Landed Cost Taxes and Charges by ID.
 */
export async function getLandedCostTaxesAndCharges(db: any, id: string) {
  const rows = await db.select().from(landedCostTaxesAndCharges).where(eq(landedCostTaxesAndCharges.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Landed Cost Taxes and Charges.
 */
export async function createLandedCostTaxesAndCharges(db: any, data: unknown) {
  const parsed = LandedCostTaxesAndChargesInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(landedCostTaxesAndCharges).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Landed Cost Taxes and Charges.
 */
export async function updateLandedCostTaxesAndCharges(db: any, id: string, data: unknown) {
  const parsed = LandedCostTaxesAndChargesInsertSchema.partial().parse(data);
  await db.update(landedCostTaxesAndCharges).set({ ...parsed, modified: new Date() }).where(eq(landedCostTaxesAndCharges.id, id));
  return getLandedCostTaxesAndCharges(db, id);
}

/**
 * Delete a Landed Cost Taxes and Charges by ID.
 */
export async function deleteLandedCostTaxesAndCharges(db: any, id: string) {
  await db.delete(landedCostTaxesAndCharges).where(eq(landedCostTaxesAndCharges.id, id));
  return { deleted: true, id };
}
