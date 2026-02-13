// CRUD API handlers for Plaid Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { plaidSettings } from '../db/schema.js';
import { PlaidSettingsSchema, PlaidSettingsInsertSchema } from '../types/plaid-settings.js';

export const ROUTE_PREFIX = '/plaid-settings';

/**
 * List Plaid Settings records.
 */
export async function listPlaidSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(plaidSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Plaid Settings by ID.
 */
export async function getPlaidSettings(db: any, id: string) {
  const rows = await db.select().from(plaidSettings).where(eq(plaidSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Plaid Settings.
 */
export async function createPlaidSettings(db: any, data: unknown) {
  const parsed = PlaidSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(plaidSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Plaid Settings.
 */
export async function updatePlaidSettings(db: any, id: string, data: unknown) {
  const parsed = PlaidSettingsInsertSchema.partial().parse(data);
  await db.update(plaidSettings).set({ ...parsed, modified: new Date() }).where(eq(plaidSettings.id, id));
  return getPlaidSettings(db, id);
}

/**
 * Delete a Plaid Settings by ID.
 */
export async function deletePlaidSettings(db: any, id: string) {
  await db.delete(plaidSettings).where(eq(plaidSettings.id, id));
  return { deleted: true, id };
}
