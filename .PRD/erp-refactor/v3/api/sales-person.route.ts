// CRUD API handlers for Sales Person
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesPerson } from '../db/schema.js';
import { SalesPersonSchema, SalesPersonInsertSchema } from '../types/sales-person.js';

export const ROUTE_PREFIX = '/sales-person';

/**
 * List Sales Person records.
 */
export async function listSalesPerson(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesPerson).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Person by ID.
 */
export async function getSalesPerson(db: any, id: string) {
  const rows = await db.select().from(salesPerson).where(eq(salesPerson.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Person.
 */
export async function createSalesPerson(db: any, data: unknown) {
  const parsed = SalesPersonInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesPerson).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Person.
 */
export async function updateSalesPerson(db: any, id: string, data: unknown) {
  const parsed = SalesPersonInsertSchema.partial().parse(data);
  await db.update(salesPerson).set({ ...parsed, modified: new Date() }).where(eq(salesPerson.id, id));
  return getSalesPerson(db, id);
}

/**
 * Delete a Sales Person by ID.
 */
export async function deleteSalesPerson(db: any, id: string) {
  await db.delete(salesPerson).where(eq(salesPerson.id, id));
  return { deleted: true, id };
}
