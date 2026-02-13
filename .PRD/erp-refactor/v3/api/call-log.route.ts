// CRUD API handlers for Call Log
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { callLog } from '../db/schema.js';
import { CallLogSchema, CallLogInsertSchema } from '../types/call-log.js';

export const ROUTE_PREFIX = '/call-log';

/**
 * List Call Log records.
 */
export async function listCallLog(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(callLog).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Call Log by ID.
 */
export async function getCallLog(db: any, id: string) {
  const rows = await db.select().from(callLog).where(eq(callLog.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Call Log.
 */
export async function createCallLog(db: any, data: unknown) {
  const parsed = CallLogInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(callLog).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Call Log.
 */
export async function updateCallLog(db: any, id: string, data: unknown) {
  const parsed = CallLogInsertSchema.partial().parse(data);
  await db.update(callLog).set({ ...parsed, modified: new Date() }).where(eq(callLog.id, id));
  return getCallLog(db, id);
}

/**
 * Delete a Call Log by ID.
 */
export async function deleteCallLog(db: any, id: string) {
  await db.delete(callLog).where(eq(callLog.id, id));
  return { deleted: true, id };
}
