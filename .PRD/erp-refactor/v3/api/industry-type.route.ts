// CRUD API handlers for Industry Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { industryType } from '../db/schema.js';
import { IndustryTypeSchema, IndustryTypeInsertSchema } from '../types/industry-type.js';

export const ROUTE_PREFIX = '/industry-type';

/**
 * List Industry Type records.
 */
export async function listIndustryType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(industryType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Industry Type by ID.
 */
export async function getIndustryType(db: any, id: string) {
  const rows = await db.select().from(industryType).where(eq(industryType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Industry Type.
 */
export async function createIndustryType(db: any, data: unknown) {
  const parsed = IndustryTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(industryType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Industry Type.
 */
export async function updateIndustryType(db: any, id: string, data: unknown) {
  const parsed = IndustryTypeInsertSchema.partial().parse(data);
  await db.update(industryType).set({ ...parsed, modified: new Date() }).where(eq(industryType.id, id));
  return getIndustryType(db, id);
}

/**
 * Delete a Industry Type by ID.
 */
export async function deleteIndustryType(db: any, id: string) {
  await db.delete(industryType).where(eq(industryType.id, id));
  return { deleted: true, id };
}
