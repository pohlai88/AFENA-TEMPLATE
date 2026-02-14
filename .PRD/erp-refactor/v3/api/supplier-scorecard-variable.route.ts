// CRUD API handlers for Supplier Scorecard Variable
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierScorecardVariable } from '../db/schema.js';
import { SupplierScorecardVariableSchema, SupplierScorecardVariableInsertSchema } from '../types/supplier-scorecard-variable.js';

export const ROUTE_PREFIX = '/supplier-scorecard-variable';

/**
 * List Supplier Scorecard Variable records.
 */
export async function listSupplierScorecardVariable(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierScorecardVariable).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Scorecard Variable by ID.
 */
export async function getSupplierScorecardVariable(db: any, id: string) {
  const rows = await db.select().from(supplierScorecardVariable).where(eq(supplierScorecardVariable.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Scorecard Variable.
 */
export async function createSupplierScorecardVariable(db: any, data: unknown) {
  const parsed = SupplierScorecardVariableInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierScorecardVariable).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Scorecard Variable.
 */
export async function updateSupplierScorecardVariable(db: any, id: string, data: unknown) {
  const parsed = SupplierScorecardVariableInsertSchema.partial().parse(data);
  await db.update(supplierScorecardVariable).set({ ...parsed, modified: new Date() }).where(eq(supplierScorecardVariable.id, id));
  return getSupplierScorecardVariable(db, id);
}

/**
 * Delete a Supplier Scorecard Variable by ID.
 */
export async function deleteSupplierScorecardVariable(db: any, id: string) {
  await db.delete(supplierScorecardVariable).where(eq(supplierScorecardVariable.id, id));
  return { deleted: true, id };
}
