// CRUD API handlers for Accounts Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { accountsSettings } from '../db/schema.js';
import { AccountsSettingsSchema, AccountsSettingsInsertSchema } from '../types/accounts-settings.js';

export const ROUTE_PREFIX = '/accounts-settings';

/**
 * List Accounts Settings records.
 */
export async function listAccountsSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(accountsSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Accounts Settings by ID.
 */
export async function getAccountsSettings(db: any, id: string) {
  const rows = await db.select().from(accountsSettings).where(eq(accountsSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Accounts Settings.
 */
export async function createAccountsSettings(db: any, data: unknown) {
  const parsed = AccountsSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(accountsSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Accounts Settings.
 */
export async function updateAccountsSettings(db: any, id: string, data: unknown) {
  const parsed = AccountsSettingsInsertSchema.partial().parse(data);
  await db.update(accountsSettings).set({ ...parsed, modified: new Date() }).where(eq(accountsSettings.id, id));
  return getAccountsSettings(db, id);
}

/**
 * Delete a Accounts Settings by ID.
 */
export async function deleteAccountsSettings(db: any, id: string) {
  await db.delete(accountsSettings).where(eq(accountsSettings.id, id));
  return { deleted: true, id };
}
