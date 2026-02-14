// CRUD API handlers for Serial No
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { serialNo } from '../db/schema.js';
import { SerialNoSchema, SerialNoInsertSchema } from '../types/serial-no.js';

export const ROUTE_PREFIX = '/serial-no';

/**
 * List Serial No records.
 */
export async function listSerialNo(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(serialNo).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Serial No by ID.
 */
export async function getSerialNo(db: any, id: string) {
  const rows = await db.select().from(serialNo).where(eq(serialNo.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Serial No.
 */
export async function createSerialNo(db: any, data: unknown) {
  const parsed = SerialNoInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(serialNo).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Serial No.
 */
export async function updateSerialNo(db: any, id: string, data: unknown) {
  const parsed = SerialNoInsertSchema.partial().parse(data);
  await db.update(serialNo).set({ ...parsed, modified: new Date() }).where(eq(serialNo.id, id));
  return getSerialNo(db, id);
}

/**
 * Delete a Serial No by ID.
 */
export async function deleteSerialNo(db: any, id: string) {
  await db.delete(serialNo).where(eq(serialNo.id, id));
  return { deleted: true, id };
}
