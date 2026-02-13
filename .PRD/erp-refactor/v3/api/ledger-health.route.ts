// CRUD API handlers for Ledger Health
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { ledgerHealth } from '../db/schema.js';
import { LedgerHealthSchema, LedgerHealthInsertSchema } from '../types/ledger-health.js';

export const ROUTE_PREFIX = '/ledger-health';

/**
 * List Ledger Health records.
 */
export async function listLedgerHealth(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(ledgerHealth).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Ledger Health by ID.
 */
export async function getLedgerHealth(db: any, id: string) {
  const rows = await db.select().from(ledgerHealth).where(eq(ledgerHealth.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Ledger Health.
 */
export async function createLedgerHealth(db: any, data: unknown) {
  const parsed = LedgerHealthInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(ledgerHealth).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Ledger Health.
 */
export async function updateLedgerHealth(db: any, id: string, data: unknown) {
  const parsed = LedgerHealthInsertSchema.partial().parse(data);
  await db.update(ledgerHealth).set({ ...parsed, modified: new Date() }).where(eq(ledgerHealth.id, id));
  return getLedgerHealth(db, id);
}

/**
 * Delete a Ledger Health by ID.
 */
export async function deleteLedgerHealth(db: any, id: string) {
  await db.delete(ledgerHealth).where(eq(ledgerHealth.id, id));
  return { deleted: true, id };
}
