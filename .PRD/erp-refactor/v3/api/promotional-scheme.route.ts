// CRUD API handlers for Promotional Scheme
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { promotionalScheme } from '../db/schema.js';
import { PromotionalSchemeSchema, PromotionalSchemeInsertSchema } from '../types/promotional-scheme.js';

export const ROUTE_PREFIX = '/promotional-scheme';

/**
 * List Promotional Scheme records.
 */
export async function listPromotionalScheme(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(promotionalScheme).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Promotional Scheme by ID.
 */
export async function getPromotionalScheme(db: any, id: string) {
  const rows = await db.select().from(promotionalScheme).where(eq(promotionalScheme.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Promotional Scheme.
 */
export async function createPromotionalScheme(db: any, data: unknown) {
  const parsed = PromotionalSchemeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(promotionalScheme).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Promotional Scheme.
 */
export async function updatePromotionalScheme(db: any, id: string, data: unknown) {
  const parsed = PromotionalSchemeInsertSchema.partial().parse(data);
  await db.update(promotionalScheme).set({ ...parsed, modified: new Date() }).where(eq(promotionalScheme.id, id));
  return getPromotionalScheme(db, id);
}

/**
 * Delete a Promotional Scheme by ID.
 */
export async function deletePromotionalScheme(db: any, id: string) {
  await db.delete(promotionalScheme).where(eq(promotionalScheme.id, id));
  return { deleted: true, id };
}
