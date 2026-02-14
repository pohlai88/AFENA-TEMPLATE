// CRUD API handlers for Driver
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { driver } from '../db/schema.js';
import { DriverSchema, DriverInsertSchema } from '../types/driver.js';

export const ROUTE_PREFIX = '/driver';

/**
 * List Driver records.
 */
export async function listDriver(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(driver).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Driver by ID.
 */
export async function getDriver(db: any, id: string) {
  const rows = await db.select().from(driver).where(eq(driver.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Driver.
 */
export async function createDriver(db: any, data: unknown) {
  const parsed = DriverInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(driver).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Driver.
 */
export async function updateDriver(db: any, id: string, data: unknown) {
  const parsed = DriverInsertSchema.partial().parse(data);
  await db.update(driver).set({ ...parsed, modified: new Date() }).where(eq(driver.id, id));
  return getDriver(db, id);
}

/**
 * Delete a Driver by ID.
 */
export async function deleteDriver(db: any, id: string) {
  await db.delete(driver).where(eq(driver.id, id));
  return { deleted: true, id };
}
