// CRUD API handlers for Subcontracting BOM
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingBom } from '../db/schema.js';
import { SubcontractingBomSchema, SubcontractingBomInsertSchema } from '../types/subcontracting-bom.js';

export const ROUTE_PREFIX = '/subcontracting-bom';

/**
 * List Subcontracting BOM records.
 */
export async function listSubcontractingBom(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingBom).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting BOM by ID.
 */
export async function getSubcontractingBom(db: any, id: string) {
  const rows = await db.select().from(subcontractingBom).where(eq(subcontractingBom.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting BOM.
 */
export async function createSubcontractingBom(db: any, data: unknown) {
  const parsed = SubcontractingBomInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingBom).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting BOM.
 */
export async function updateSubcontractingBom(db: any, id: string, data: unknown) {
  const parsed = SubcontractingBomInsertSchema.partial().parse(data);
  await db.update(subcontractingBom).set({ ...parsed, modified: new Date() }).where(eq(subcontractingBom.id, id));
  return getSubcontractingBom(db, id);
}

/**
 * Delete a Subcontracting BOM by ID.
 */
export async function deleteSubcontractingBom(db: any, id: string) {
  await db.delete(subcontractingBom).where(eq(subcontractingBom.id, id));
  return { deleted: true, id };
}
