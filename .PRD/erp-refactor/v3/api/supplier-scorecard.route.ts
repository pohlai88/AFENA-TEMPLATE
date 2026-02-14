// CRUD API handlers for Supplier Scorecard
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierScorecard } from '../db/schema.js';
import { SupplierScorecardSchema, SupplierScorecardInsertSchema } from '../types/supplier-scorecard.js';

export const ROUTE_PREFIX = '/supplier-scorecard';

/**
 * List Supplier Scorecard records.
 */
export async function listSupplierScorecard(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierScorecard).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Scorecard by ID.
 */
export async function getSupplierScorecard(db: any, id: string) {
  const rows = await db.select().from(supplierScorecard).where(eq(supplierScorecard.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Scorecard.
 */
export async function createSupplierScorecard(db: any, data: unknown) {
  const parsed = SupplierScorecardInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierScorecard).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Scorecard.
 */
export async function updateSupplierScorecard(db: any, id: string, data: unknown) {
  const parsed = SupplierScorecardInsertSchema.partial().parse(data);
  await db.update(supplierScorecard).set({ ...parsed, modified: new Date() }).where(eq(supplierScorecard.id, id));
  return getSupplierScorecard(db, id);
}

/**
 * Delete a Supplier Scorecard by ID.
 */
export async function deleteSupplierScorecard(db: any, id: string) {
  await db.delete(supplierScorecard).where(eq(supplierScorecard.id, id));
  return { deleted: true, id };
}
