// CRUD API handlers for Sales Partner
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesPartner } from '../db/schema.js';
import { SalesPartnerSchema, SalesPartnerInsertSchema } from '../types/sales-partner.js';

export const ROUTE_PREFIX = '/sales-partner';

/**
 * List Sales Partner records.
 */
export async function listSalesPartner(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesPartner).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Partner by ID.
 */
export async function getSalesPartner(db: any, id: string) {
  const rows = await db.select().from(salesPartner).where(eq(salesPartner.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Partner.
 */
export async function createSalesPartner(db: any, data: unknown) {
  const parsed = SalesPartnerInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesPartner).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Partner.
 */
export async function updateSalesPartner(db: any, id: string, data: unknown) {
  const parsed = SalesPartnerInsertSchema.partial().parse(data);
  await db.update(salesPartner).set({ ...parsed, modified: new Date() }).where(eq(salesPartner.id, id));
  return getSalesPartner(db, id);
}

/**
 * Delete a Sales Partner by ID.
 */
export async function deleteSalesPartner(db: any, id: string) {
  await db.delete(salesPartner).where(eq(salesPartner.id, id));
  return { deleted: true, id };
}
