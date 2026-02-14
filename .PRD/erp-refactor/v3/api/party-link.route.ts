// CRUD API handlers for Party Link
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { partyLink } from '../db/schema.js';
import { PartyLinkSchema, PartyLinkInsertSchema } from '../types/party-link.js';

export const ROUTE_PREFIX = '/party-link';

/**
 * List Party Link records.
 */
export async function listPartyLink(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(partyLink).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Party Link by ID.
 */
export async function getPartyLink(db: any, id: string) {
  const rows = await db.select().from(partyLink).where(eq(partyLink.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Party Link.
 */
export async function createPartyLink(db: any, data: unknown) {
  const parsed = PartyLinkInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(partyLink).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Party Link.
 */
export async function updatePartyLink(db: any, id: string, data: unknown) {
  const parsed = PartyLinkInsertSchema.partial().parse(data);
  await db.update(partyLink).set({ ...parsed, modified: new Date() }).where(eq(partyLink.id, id));
  return getPartyLink(db, id);
}

/**
 * Delete a Party Link by ID.
 */
export async function deletePartyLink(db: any, id: string) {
  await db.delete(partyLink).where(eq(partyLink.id, id));
  return { deleted: true, id };
}
