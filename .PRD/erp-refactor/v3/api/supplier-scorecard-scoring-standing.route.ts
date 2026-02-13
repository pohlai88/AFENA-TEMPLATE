// CRUD API handlers for Supplier Scorecard Scoring Standing
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierScorecardScoringStanding } from '../db/schema.js';
import { SupplierScorecardScoringStandingSchema, SupplierScorecardScoringStandingInsertSchema } from '../types/supplier-scorecard-scoring-standing.js';

export const ROUTE_PREFIX = '/supplier-scorecard-scoring-standing';

/**
 * List Supplier Scorecard Scoring Standing records.
 */
export async function listSupplierScorecardScoringStanding(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierScorecardScoringStanding).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Scorecard Scoring Standing by ID.
 */
export async function getSupplierScorecardScoringStanding(db: any, id: string) {
  const rows = await db.select().from(supplierScorecardScoringStanding).where(eq(supplierScorecardScoringStanding.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Scorecard Scoring Standing.
 */
export async function createSupplierScorecardScoringStanding(db: any, data: unknown) {
  const parsed = SupplierScorecardScoringStandingInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierScorecardScoringStanding).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Scorecard Scoring Standing.
 */
export async function updateSupplierScorecardScoringStanding(db: any, id: string, data: unknown) {
  const parsed = SupplierScorecardScoringStandingInsertSchema.partial().parse(data);
  await db.update(supplierScorecardScoringStanding).set({ ...parsed, modified: new Date() }).where(eq(supplierScorecardScoringStanding.id, id));
  return getSupplierScorecardScoringStanding(db, id);
}

/**
 * Delete a Supplier Scorecard Scoring Standing by ID.
 */
export async function deleteSupplierScorecardScoringStanding(db: any, id: string) {
  await db.delete(supplierScorecardScoringStanding).where(eq(supplierScorecardScoringStanding.id, id));
  return { deleted: true, id };
}
