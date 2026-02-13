// CRUD API handlers for Packing Slip
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { packingSlip } from '../db/schema.js';
import { PackingSlipSchema, PackingSlipInsertSchema } from '../types/packing-slip.js';

export const ROUTE_PREFIX = '/packing-slip';

/**
 * List Packing Slip records.
 */
export async function listPackingSlip(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(packingSlip).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Packing Slip by ID.
 */
export async function getPackingSlip(db: any, id: string) {
  const rows = await db.select().from(packingSlip).where(eq(packingSlip.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Packing Slip.
 */
export async function createPackingSlip(db: any, data: unknown) {
  const parsed = PackingSlipInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(packingSlip).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Packing Slip.
 */
export async function updatePackingSlip(db: any, id: string, data: unknown) {
  const parsed = PackingSlipInsertSchema.partial().parse(data);
  await db.update(packingSlip).set({ ...parsed, modified: new Date() }).where(eq(packingSlip.id, id));
  return getPackingSlip(db, id);
}

/**
 * Delete a Packing Slip by ID.
 */
export async function deletePackingSlip(db: any, id: string) {
  await db.delete(packingSlip).where(eq(packingSlip.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Packing Slip (set docstatus = 1).
 */
export async function submitPackingSlip(db: any, id: string) {
  await db.update(packingSlip).set({ docstatus: 1, modified: new Date() }).where(eq(packingSlip.id, id));
  return getPackingSlip(db, id);
}

/**
 * Cancel a Packing Slip (set docstatus = 2).
 */
export async function cancelPackingSlip(db: any, id: string) {
  await db.update(packingSlip).set({ docstatus: 2, modified: new Date() }).where(eq(packingSlip.id, id));
  return getPackingSlip(db, id);
}
