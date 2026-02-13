// CRUD API handlers for Supplier Scorecard Standing
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierScorecardStanding } from '../db/schema.js';
import { SupplierScorecardStandingSchema, SupplierScorecardStandingInsertSchema } from '../types/supplier-scorecard-standing.js';

export const ROUTE_PREFIX = '/supplier-scorecard-standing';

/**
 * List Supplier Scorecard Standing records.
 */
export async function listSupplierScorecardStanding(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierScorecardStanding).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Scorecard Standing by ID.
 */
export async function getSupplierScorecardStanding(db: any, id: string) {
  const rows = await db.select().from(supplierScorecardStanding).where(eq(supplierScorecardStanding.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Scorecard Standing.
 */
export async function createSupplierScorecardStanding(db: any, data: unknown) {
  const parsed = SupplierScorecardStandingInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierScorecardStanding).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Scorecard Standing.
 */
export async function updateSupplierScorecardStanding(db: any, id: string, data: unknown) {
  const parsed = SupplierScorecardStandingInsertSchema.partial().parse(data);
  await db.update(supplierScorecardStanding).set({ ...parsed, modified: new Date() }).where(eq(supplierScorecardStanding.id, id));
  return getSupplierScorecardStanding(db, id);
}

/**
 * Delete a Supplier Scorecard Standing by ID.
 */
export async function deleteSupplierScorecardStanding(db: any, id: string) {
  await db.delete(supplierScorecardStanding).where(eq(supplierScorecardStanding.id, id));
  return { deleted: true, id };
}
