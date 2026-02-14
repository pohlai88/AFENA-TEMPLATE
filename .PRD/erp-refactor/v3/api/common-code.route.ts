// CRUD API handlers for Common Code
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { commonCode } from '../db/schema.js';
import { CommonCodeSchema, CommonCodeInsertSchema } from '../types/common-code.js';

export const ROUTE_PREFIX = '/common-code';

/**
 * List Common Code records.
 */
export async function listCommonCode(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(commonCode).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Common Code by ID.
 */
export async function getCommonCode(db: any, id: string) {
  const rows = await db.select().from(commonCode).where(eq(commonCode.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Common Code.
 */
export async function createCommonCode(db: any, data: unknown) {
  const parsed = CommonCodeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(commonCode).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Common Code.
 */
export async function updateCommonCode(db: any, id: string, data: unknown) {
  const parsed = CommonCodeInsertSchema.partial().parse(data);
  await db.update(commonCode).set({ ...parsed, modified: new Date() }).where(eq(commonCode.id, id));
  return getCommonCode(db, id);
}

/**
 * Delete a Common Code by ID.
 */
export async function deleteCommonCode(db: any, id: string) {
  await db.delete(commonCode).where(eq(commonCode.id, id));
  return { deleted: true, id };
}
