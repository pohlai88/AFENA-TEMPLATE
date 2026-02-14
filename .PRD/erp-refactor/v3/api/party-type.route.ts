// CRUD API handlers for Party Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { partyType } from '../db/schema.js';
import { PartyTypeSchema, PartyTypeInsertSchema } from '../types/party-type.js';

export const ROUTE_PREFIX = '/party-type';

/**
 * List Party Type records.
 */
export async function listPartyType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(partyType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Party Type by ID.
 */
export async function getPartyType(db: any, id: string) {
  const rows = await db.select().from(partyType).where(eq(partyType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Party Type.
 */
export async function createPartyType(db: any, data: unknown) {
  const parsed = PartyTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(partyType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Party Type.
 */
export async function updatePartyType(db: any, id: string, data: unknown) {
  const parsed = PartyTypeInsertSchema.partial().parse(data);
  await db.update(partyType).set({ ...parsed, modified: new Date() }).where(eq(partyType.id, id));
  return getPartyType(db, id);
}

/**
 * Delete a Party Type by ID.
 */
export async function deletePartyType(db: any, id: string) {
  await db.delete(partyType).where(eq(partyType.id, id));
  return { deleted: true, id };
}
