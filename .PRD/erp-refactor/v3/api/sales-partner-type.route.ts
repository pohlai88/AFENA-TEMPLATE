// CRUD API handlers for Sales Partner Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesPartnerType } from '../db/schema.js';
import { SalesPartnerTypeSchema, SalesPartnerTypeInsertSchema } from '../types/sales-partner-type.js';

export const ROUTE_PREFIX = '/sales-partner-type';

/**
 * List Sales Partner Type records.
 */
export async function listSalesPartnerType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesPartnerType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Partner Type by ID.
 */
export async function getSalesPartnerType(db: any, id: string) {
  const rows = await db.select().from(salesPartnerType).where(eq(salesPartnerType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Partner Type.
 */
export async function createSalesPartnerType(db: any, data: unknown) {
  const parsed = SalesPartnerTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesPartnerType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Partner Type.
 */
export async function updateSalesPartnerType(db: any, id: string, data: unknown) {
  const parsed = SalesPartnerTypeInsertSchema.partial().parse(data);
  await db.update(salesPartnerType).set({ ...parsed, modified: new Date() }).where(eq(salesPartnerType.id, id));
  return getSalesPartnerType(db, id);
}

/**
 * Delete a Sales Partner Type by ID.
 */
export async function deleteSalesPartnerType(db: any, id: string) {
  await db.delete(salesPartnerType).where(eq(salesPartnerType.id, id));
  return { deleted: true, id };
}
