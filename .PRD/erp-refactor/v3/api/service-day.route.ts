// CRUD API handlers for Service Day
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { serviceDay } from '../db/schema.js';
import { ServiceDaySchema, ServiceDayInsertSchema } from '../types/service-day.js';

export const ROUTE_PREFIX = '/service-day';

/**
 * List Service Day records.
 */
export async function listServiceDay(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(serviceDay).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Service Day by ID.
 */
export async function getServiceDay(db: any, id: string) {
  const rows = await db.select().from(serviceDay).where(eq(serviceDay.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Service Day.
 */
export async function createServiceDay(db: any, data: unknown) {
  const parsed = ServiceDayInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(serviceDay).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Service Day.
 */
export async function updateServiceDay(db: any, id: string, data: unknown) {
  const parsed = ServiceDayInsertSchema.partial().parse(data);
  await db.update(serviceDay).set({ ...parsed, modified: new Date() }).where(eq(serviceDay.id, id));
  return getServiceDay(db, id);
}

/**
 * Delete a Service Day by ID.
 */
export async function deleteServiceDay(db: any, id: string) {
  await db.delete(serviceDay).where(eq(serviceDay.id, id));
  return { deleted: true, id };
}
