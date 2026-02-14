// CRUD API handlers for Repost Accounting Ledger Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { repostAccountingLedgerSettings } from '../db/schema.js';
import { RepostAccountingLedgerSettingsSchema, RepostAccountingLedgerSettingsInsertSchema } from '../types/repost-accounting-ledger-settings.js';

export const ROUTE_PREFIX = '/repost-accounting-ledger-settings';

/**
 * List Repost Accounting Ledger Settings records.
 */
export async function listRepostAccountingLedgerSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(repostAccountingLedgerSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Repost Accounting Ledger Settings by ID.
 */
export async function getRepostAccountingLedgerSettings(db: any, id: string) {
  const rows = await db.select().from(repostAccountingLedgerSettings).where(eq(repostAccountingLedgerSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Repost Accounting Ledger Settings.
 */
export async function createRepostAccountingLedgerSettings(db: any, data: unknown) {
  const parsed = RepostAccountingLedgerSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(repostAccountingLedgerSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Repost Accounting Ledger Settings.
 */
export async function updateRepostAccountingLedgerSettings(db: any, id: string, data: unknown) {
  const parsed = RepostAccountingLedgerSettingsInsertSchema.partial().parse(data);
  await db.update(repostAccountingLedgerSettings).set({ ...parsed, modified: new Date() }).where(eq(repostAccountingLedgerSettings.id, id));
  return getRepostAccountingLedgerSettings(db, id);
}

/**
 * Delete a Repost Accounting Ledger Settings by ID.
 */
export async function deleteRepostAccountingLedgerSettings(db: any, id: string) {
  await db.delete(repostAccountingLedgerSettings).where(eq(repostAccountingLedgerSettings.id, id));
  return { deleted: true, id };
}
