// CRUD API handlers for Supplier Scorecard Criteria
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierScorecardCriteria } from '../db/schema.js';
import { SupplierScorecardCriteriaSchema, SupplierScorecardCriteriaInsertSchema } from '../types/supplier-scorecard-criteria.js';

export const ROUTE_PREFIX = '/supplier-scorecard-criteria';

/**
 * List Supplier Scorecard Criteria records.
 */
export async function listSupplierScorecardCriteria(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierScorecardCriteria).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Scorecard Criteria by ID.
 */
export async function getSupplierScorecardCriteria(db: any, id: string) {
  const rows = await db.select().from(supplierScorecardCriteria).where(eq(supplierScorecardCriteria.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Scorecard Criteria.
 */
export async function createSupplierScorecardCriteria(db: any, data: unknown) {
  const parsed = SupplierScorecardCriteriaInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierScorecardCriteria).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Scorecard Criteria.
 */
export async function updateSupplierScorecardCriteria(db: any, id: string, data: unknown) {
  const parsed = SupplierScorecardCriteriaInsertSchema.partial().parse(data);
  await db.update(supplierScorecardCriteria).set({ ...parsed, modified: new Date() }).where(eq(supplierScorecardCriteria.id, id));
  return getSupplierScorecardCriteria(db, id);
}

/**
 * Delete a Supplier Scorecard Criteria by ID.
 */
export async function deleteSupplierScorecardCriteria(db: any, id: string) {
  await db.delete(supplierScorecardCriteria).where(eq(supplierScorecardCriteria.id, id));
  return { deleted: true, id };
}
