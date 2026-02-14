// CRUD API handlers for Driving License Category
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { drivingLicenseCategory } from '../db/schema.js';
import { DrivingLicenseCategorySchema, DrivingLicenseCategoryInsertSchema } from '../types/driving-license-category.js';

export const ROUTE_PREFIX = '/driving-license-category';

/**
 * List Driving License Category records.
 */
export async function listDrivingLicenseCategory(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(drivingLicenseCategory).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Driving License Category by ID.
 */
export async function getDrivingLicenseCategory(db: any, id: string) {
  const rows = await db.select().from(drivingLicenseCategory).where(eq(drivingLicenseCategory.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Driving License Category.
 */
export async function createDrivingLicenseCategory(db: any, data: unknown) {
  const parsed = DrivingLicenseCategoryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(drivingLicenseCategory).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Driving License Category.
 */
export async function updateDrivingLicenseCategory(db: any, id: string, data: unknown) {
  const parsed = DrivingLicenseCategoryInsertSchema.partial().parse(data);
  await db.update(drivingLicenseCategory).set({ ...parsed, modified: new Date() }).where(eq(drivingLicenseCategory.id, id));
  return getDrivingLicenseCategory(db, id);
}

/**
 * Delete a Driving License Category by ID.
 */
export async function deleteDrivingLicenseCategory(db: any, id: string) {
  await db.delete(drivingLicenseCategory).where(eq(drivingLicenseCategory.id, id));
  return { deleted: true, id };
}
