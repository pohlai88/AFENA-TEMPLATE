// CRUD API handlers for Telephony Call Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { telephonyCallType } from '../db/schema.js';
import { TelephonyCallTypeSchema, TelephonyCallTypeInsertSchema } from '../types/telephony-call-type.js';

export const ROUTE_PREFIX = '/telephony-call-type';

/**
 * List Telephony Call Type records.
 */
export async function listTelephonyCallType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(telephonyCallType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Telephony Call Type by ID.
 */
export async function getTelephonyCallType(db: any, id: string) {
  const rows = await db.select().from(telephonyCallType).where(eq(telephonyCallType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Telephony Call Type.
 */
export async function createTelephonyCallType(db: any, data: unknown) {
  const parsed = TelephonyCallTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(telephonyCallType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Telephony Call Type.
 */
export async function updateTelephonyCallType(db: any, id: string, data: unknown) {
  const parsed = TelephonyCallTypeInsertSchema.partial().parse(data);
  await db.update(telephonyCallType).set({ ...parsed, modified: new Date() }).where(eq(telephonyCallType.id, id));
  return getTelephonyCallType(db, id);
}

/**
 * Delete a Telephony Call Type by ID.
 */
export async function deleteTelephonyCallType(db: any, id: string) {
  await db.delete(telephonyCallType).where(eq(telephonyCallType.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Telephony Call Type (set docstatus = 1).
 */
export async function submitTelephonyCallType(db: any, id: string) {
  await db.update(telephonyCallType).set({ docstatus: 1, modified: new Date() }).where(eq(telephonyCallType.id, id));
  return getTelephonyCallType(db, id);
}

/**
 * Cancel a Telephony Call Type (set docstatus = 2).
 */
export async function cancelTelephonyCallType(db: any, id: string) {
  await db.update(telephonyCallType).set({ docstatus: 2, modified: new Date() }).where(eq(telephonyCallType.id, id));
  return getTelephonyCallType(db, id);
}
