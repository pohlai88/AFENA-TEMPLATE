// CRUD API handlers for Party Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { partyAccount } from '../db/schema.js';
import { PartyAccountSchema, PartyAccountInsertSchema } from '../types/party-account.js';

export const ROUTE_PREFIX = '/party-account';

/**
 * List Party Account records.
 */
export async function listPartyAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(partyAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Party Account by ID.
 */
export async function getPartyAccount(db: any, id: string) {
  const rows = await db.select().from(partyAccount).where(eq(partyAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Party Account.
 */
export async function createPartyAccount(db: any, data: unknown) {
  const parsed = PartyAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(partyAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Party Account.
 */
export async function updatePartyAccount(db: any, id: string, data: unknown) {
  const parsed = PartyAccountInsertSchema.partial().parse(data);
  await db.update(partyAccount).set({ ...parsed, modified: new Date() }).where(eq(partyAccount.id, id));
  return getPartyAccount(db, id);
}

/**
 * Delete a Party Account by ID.
 */
export async function deletePartyAccount(db: any, id: string) {
  await db.delete(partyAccount).where(eq(partyAccount.id, id));
  return { deleted: true, id };
}
