// CRUD API handlers for Company
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { company } from '../db/schema.js';
import { CompanySchema, CompanyInsertSchema } from '../types/company.js';

export const ROUTE_PREFIX = '/company';

/**
 * List Company records.
 */
export async function listCompany(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(company).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Company by ID.
 */
export async function getCompany(db: any, id: string) {
  const rows = await db.select().from(company).where(eq(company.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Company.
 */
export async function createCompany(db: any, data: unknown) {
  const parsed = CompanyInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(company).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Company.
 */
export async function updateCompany(db: any, id: string, data: unknown) {
  const parsed = CompanyInsertSchema.partial().parse(data);
  await db.update(company).set({ ...parsed, modified: new Date() }).where(eq(company.id, id));
  return getCompany(db, id);
}

/**
 * Delete a Company by ID.
 */
export async function deleteCompany(db: any, id: string) {
  await db.delete(company).where(eq(company.id, id));
  return { deleted: true, id };
}
