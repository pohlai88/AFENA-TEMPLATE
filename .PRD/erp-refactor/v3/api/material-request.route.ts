// CRUD API handlers for Material Request
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { materialRequest } from '../db/schema.js';
import { MaterialRequestSchema, MaterialRequestInsertSchema } from '../types/material-request.js';

export const ROUTE_PREFIX = '/material-request';

/**
 * List Material Request records.
 */
export async function listMaterialRequest(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(materialRequest).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Material Request by ID.
 */
export async function getMaterialRequest(db: any, id: string) {
  const rows = await db.select().from(materialRequest).where(eq(materialRequest.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Material Request.
 */
export async function createMaterialRequest(db: any, data: unknown) {
  const parsed = MaterialRequestInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(materialRequest).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Material Request.
 */
export async function updateMaterialRequest(db: any, id: string, data: unknown) {
  const parsed = MaterialRequestInsertSchema.partial().parse(data);
  await db.update(materialRequest).set({ ...parsed, modified: new Date() }).where(eq(materialRequest.id, id));
  return getMaterialRequest(db, id);
}

/**
 * Delete a Material Request by ID.
 */
export async function deleteMaterialRequest(db: any, id: string) {
  await db.delete(materialRequest).where(eq(materialRequest.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Material Request (set docstatus = 1).
 */
export async function submitMaterialRequest(db: any, id: string) {
  await db.update(materialRequest).set({ docstatus: 1, modified: new Date() }).where(eq(materialRequest.id, id));
  return getMaterialRequest(db, id);
}

/**
 * Cancel a Material Request (set docstatus = 2).
 */
export async function cancelMaterialRequest(db: any, id: string) {
  await db.update(materialRequest).set({ docstatus: 2, modified: new Date() }).where(eq(materialRequest.id, id));
  return getMaterialRequest(db, id);
}
