// CRUD API handlers for Party Specific Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { partySpecificItem } from '../db/schema.js';
import { PartySpecificItemSchema, PartySpecificItemInsertSchema } from '../types/party-specific-item.js';

export const ROUTE_PREFIX = '/party-specific-item';

/**
 * List Party Specific Item records.
 */
export async function listPartySpecificItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(partySpecificItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Party Specific Item by ID.
 */
export async function getPartySpecificItem(db: any, id: string) {
  const rows = await db.select().from(partySpecificItem).where(eq(partySpecificItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Party Specific Item.
 */
export async function createPartySpecificItem(db: any, data: unknown) {
  const parsed = PartySpecificItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(partySpecificItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Party Specific Item.
 */
export async function updatePartySpecificItem(db: any, id: string, data: unknown) {
  const parsed = PartySpecificItemInsertSchema.partial().parse(data);
  await db.update(partySpecificItem).set({ ...parsed, modified: new Date() }).where(eq(partySpecificItem.id, id));
  return getPartySpecificItem(db, id);
}

/**
 * Delete a Party Specific Item by ID.
 */
export async function deletePartySpecificItem(db: any, id: string) {
  await db.delete(partySpecificItem).where(eq(partySpecificItem.id, id));
  return { deleted: true, id };
}
