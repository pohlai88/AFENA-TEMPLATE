// CRUD API handlers for PSOA Cost Center
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { psoaCostCenter } from '../db/schema.js';
import { PsoaCostCenterSchema, PsoaCostCenterInsertSchema } from '../types/psoa-cost-center.js';

export const ROUTE_PREFIX = '/psoa-cost-center';

/**
 * List PSOA Cost Center records.
 */
export async function listPsoaCostCenter(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(psoaCostCenter).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single PSOA Cost Center by ID.
 */
export async function getPsoaCostCenter(db: any, id: string) {
  const rows = await db.select().from(psoaCostCenter).where(eq(psoaCostCenter.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new PSOA Cost Center.
 */
export async function createPsoaCostCenter(db: any, data: unknown) {
  const parsed = PsoaCostCenterInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(psoaCostCenter).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing PSOA Cost Center.
 */
export async function updatePsoaCostCenter(db: any, id: string, data: unknown) {
  const parsed = PsoaCostCenterInsertSchema.partial().parse(data);
  await db.update(psoaCostCenter).set({ ...parsed, modified: new Date() }).where(eq(psoaCostCenter.id, id));
  return getPsoaCostCenter(db, id);
}

/**
 * Delete a PSOA Cost Center by ID.
 */
export async function deletePsoaCostCenter(db: any, id: string) {
  await db.delete(psoaCostCenter).where(eq(psoaCostCenter.id, id));
  return { deleted: true, id };
}
