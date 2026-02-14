// CRUD API handlers for Supplier Scorecard Scoring Variable
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierScorecardScoringVariable } from '../db/schema.js';
import { SupplierScorecardScoringVariableSchema, SupplierScorecardScoringVariableInsertSchema } from '../types/supplier-scorecard-scoring-variable.js';

export const ROUTE_PREFIX = '/supplier-scorecard-scoring-variable';

/**
 * List Supplier Scorecard Scoring Variable records.
 */
export async function listSupplierScorecardScoringVariable(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierScorecardScoringVariable).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Scorecard Scoring Variable by ID.
 */
export async function getSupplierScorecardScoringVariable(db: any, id: string) {
  const rows = await db.select().from(supplierScorecardScoringVariable).where(eq(supplierScorecardScoringVariable.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Scorecard Scoring Variable.
 */
export async function createSupplierScorecardScoringVariable(db: any, data: unknown) {
  const parsed = SupplierScorecardScoringVariableInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierScorecardScoringVariable).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Scorecard Scoring Variable.
 */
export async function updateSupplierScorecardScoringVariable(db: any, id: string, data: unknown) {
  const parsed = SupplierScorecardScoringVariableInsertSchema.partial().parse(data);
  await db.update(supplierScorecardScoringVariable).set({ ...parsed, modified: new Date() }).where(eq(supplierScorecardScoringVariable.id, id));
  return getSupplierScorecardScoringVariable(db, id);
}

/**
 * Delete a Supplier Scorecard Scoring Variable by ID.
 */
export async function deleteSupplierScorecardScoringVariable(db: any, id: string) {
  await db.delete(supplierScorecardScoringVariable).where(eq(supplierScorecardScoringVariable.id, id));
  return { deleted: true, id };
}
