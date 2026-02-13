// CRUD API handlers for Routing
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { routing } from '../db/schema.js';
import { RoutingSchema, RoutingInsertSchema } from '../types/routing.js';

export const ROUTE_PREFIX = '/routing';

/**
 * List Routing records.
 */
export async function listRouting(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(routing).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Routing by ID.
 */
export async function getRouting(db: any, id: string) {
  const rows = await db.select().from(routing).where(eq(routing.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Routing.
 */
export async function createRouting(db: any, data: unknown) {
  const parsed = RoutingInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(routing).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Routing.
 */
export async function updateRouting(db: any, id: string, data: unknown) {
  const parsed = RoutingInsertSchema.partial().parse(data);
  await db.update(routing).set({ ...parsed, modified: new Date() }).where(eq(routing.id, id));
  return getRouting(db, id);
}

/**
 * Delete a Routing by ID.
 */
export async function deleteRouting(db: any, id: string) {
  await db.delete(routing).where(eq(routing.id, id));
  return { deleted: true, id };
}
