// CRUD API handlers for Supplier Scorecard Period
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierScorecardPeriod } from '../db/schema.js';
import { SupplierScorecardPeriodSchema, SupplierScorecardPeriodInsertSchema } from '../types/supplier-scorecard-period.js';

export const ROUTE_PREFIX = '/supplier-scorecard-period';

/**
 * List Supplier Scorecard Period records.
 */
export async function listSupplierScorecardPeriod(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierScorecardPeriod).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Scorecard Period by ID.
 */
export async function getSupplierScorecardPeriod(db: any, id: string) {
  const rows = await db.select().from(supplierScorecardPeriod).where(eq(supplierScorecardPeriod.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Scorecard Period.
 */
export async function createSupplierScorecardPeriod(db: any, data: unknown) {
  const parsed = SupplierScorecardPeriodInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierScorecardPeriod).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Scorecard Period.
 */
export async function updateSupplierScorecardPeriod(db: any, id: string, data: unknown) {
  const parsed = SupplierScorecardPeriodInsertSchema.partial().parse(data);
  await db.update(supplierScorecardPeriod).set({ ...parsed, modified: new Date() }).where(eq(supplierScorecardPeriod.id, id));
  return getSupplierScorecardPeriod(db, id);
}

/**
 * Delete a Supplier Scorecard Period by ID.
 */
export async function deleteSupplierScorecardPeriod(db: any, id: string) {
  await db.delete(supplierScorecardPeriod).where(eq(supplierScorecardPeriod.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Supplier Scorecard Period (set docstatus = 1).
 */
export async function submitSupplierScorecardPeriod(db: any, id: string) {
  await db.update(supplierScorecardPeriod).set({ docstatus: 1, modified: new Date() }).where(eq(supplierScorecardPeriod.id, id));
  return getSupplierScorecardPeriod(db, id);
}

/**
 * Cancel a Supplier Scorecard Period (set docstatus = 2).
 */
export async function cancelSupplierScorecardPeriod(db: any, id: string) {
  await db.update(supplierScorecardPeriod).set({ docstatus: 2, modified: new Date() }).where(eq(supplierScorecardPeriod.id, id));
  return getSupplierScorecardPeriod(db, id);
}
