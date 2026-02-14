// CRUD API handlers for Supplier Scorecard Scoring Criteria
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierScorecardScoringCriteria } from '../db/schema.js';
import { SupplierScorecardScoringCriteriaSchema, SupplierScorecardScoringCriteriaInsertSchema } from '../types/supplier-scorecard-scoring-criteria.js';

export const ROUTE_PREFIX = '/supplier-scorecard-scoring-criteria';

/**
 * List Supplier Scorecard Scoring Criteria records.
 */
export async function listSupplierScorecardScoringCriteria(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierScorecardScoringCriteria).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Scorecard Scoring Criteria by ID.
 */
export async function getSupplierScorecardScoringCriteria(db: any, id: string) {
  const rows = await db.select().from(supplierScorecardScoringCriteria).where(eq(supplierScorecardScoringCriteria.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Scorecard Scoring Criteria.
 */
export async function createSupplierScorecardScoringCriteria(db: any, data: unknown) {
  const parsed = SupplierScorecardScoringCriteriaInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierScorecardScoringCriteria).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Scorecard Scoring Criteria.
 */
export async function updateSupplierScorecardScoringCriteria(db: any, id: string, data: unknown) {
  const parsed = SupplierScorecardScoringCriteriaInsertSchema.partial().parse(data);
  await db.update(supplierScorecardScoringCriteria).set({ ...parsed, modified: new Date() }).where(eq(supplierScorecardScoringCriteria.id, id));
  return getSupplierScorecardScoringCriteria(db, id);
}

/**
 * Delete a Supplier Scorecard Scoring Criteria by ID.
 */
export async function deleteSupplierScorecardScoringCriteria(db: any, id: string) {
  await db.delete(supplierScorecardScoringCriteria).where(eq(supplierScorecardScoringCriteria.id, id));
  return { deleted: true, id };
}
