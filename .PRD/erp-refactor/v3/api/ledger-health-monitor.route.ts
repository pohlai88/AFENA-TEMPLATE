// CRUD API handlers for Ledger Health Monitor
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { ledgerHealthMonitor } from '../db/schema.js';
import { LedgerHealthMonitorSchema, LedgerHealthMonitorInsertSchema } from '../types/ledger-health-monitor.js';

export const ROUTE_PREFIX = '/ledger-health-monitor';

/**
 * List Ledger Health Monitor records.
 */
export async function listLedgerHealthMonitor(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(ledgerHealthMonitor).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Ledger Health Monitor by ID.
 */
export async function getLedgerHealthMonitor(db: any, id: string) {
  const rows = await db.select().from(ledgerHealthMonitor).where(eq(ledgerHealthMonitor.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Ledger Health Monitor.
 */
export async function createLedgerHealthMonitor(db: any, data: unknown) {
  const parsed = LedgerHealthMonitorInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(ledgerHealthMonitor).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Ledger Health Monitor.
 */
export async function updateLedgerHealthMonitor(db: any, id: string, data: unknown) {
  const parsed = LedgerHealthMonitorInsertSchema.partial().parse(data);
  await db.update(ledgerHealthMonitor).set({ ...parsed, modified: new Date() }).where(eq(ledgerHealthMonitor.id, id));
  return getLedgerHealthMonitor(db, id);
}

/**
 * Delete a Ledger Health Monitor by ID.
 */
export async function deleteLedgerHealthMonitor(db: any, id: string) {
  await db.delete(ledgerHealthMonitor).where(eq(ledgerHealthMonitor.id, id));
  return { deleted: true, id };
}
