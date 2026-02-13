// CRUD API handlers for SMS Center
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { smsCenter } from '../db/schema.js';
import { SmsCenterSchema, SmsCenterInsertSchema } from '../types/sms-center.js';

export const ROUTE_PREFIX = '/sms-center';

/**
 * List SMS Center records.
 */
export async function listSmsCenter(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(smsCenter).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single SMS Center by ID.
 */
export async function getSmsCenter(db: any, id: string) {
  const rows = await db.select().from(smsCenter).where(eq(smsCenter.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new SMS Center.
 */
export async function createSmsCenter(db: any, data: unknown) {
  const parsed = SmsCenterInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(smsCenter).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing SMS Center.
 */
export async function updateSmsCenter(db: any, id: string, data: unknown) {
  const parsed = SmsCenterInsertSchema.partial().parse(data);
  await db.update(smsCenter).set({ ...parsed, modified: new Date() }).where(eq(smsCenter.id, id));
  return getSmsCenter(db, id);
}

/**
 * Delete a SMS Center by ID.
 */
export async function deleteSmsCenter(db: any, id: string) {
  await db.delete(smsCenter).where(eq(smsCenter.id, id));
  return { deleted: true, id };
}
