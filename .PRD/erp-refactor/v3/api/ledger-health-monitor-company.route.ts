// CRUD API handlers for Ledger Health Monitor Company
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { ledgerHealthMonitorCompany } from '../db/schema.js';
import { LedgerHealthMonitorCompanySchema, LedgerHealthMonitorCompanyInsertSchema } from '../types/ledger-health-monitor-company.js';

export const ROUTE_PREFIX = '/ledger-health-monitor-company';

/**
 * List Ledger Health Monitor Company records.
 */
export async function listLedgerHealthMonitorCompany(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(ledgerHealthMonitorCompany).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Ledger Health Monitor Company by ID.
 */
export async function getLedgerHealthMonitorCompany(db: any, id: string) {
  const rows = await db.select().from(ledgerHealthMonitorCompany).where(eq(ledgerHealthMonitorCompany.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Ledger Health Monitor Company.
 */
export async function createLedgerHealthMonitorCompany(db: any, data: unknown) {
  const parsed = LedgerHealthMonitorCompanyInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(ledgerHealthMonitorCompany).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Ledger Health Monitor Company.
 */
export async function updateLedgerHealthMonitorCompany(db: any, id: string, data: unknown) {
  const parsed = LedgerHealthMonitorCompanyInsertSchema.partial().parse(data);
  await db.update(ledgerHealthMonitorCompany).set({ ...parsed, modified: new Date() }).where(eq(ledgerHealthMonitorCompany.id, id));
  return getLedgerHealthMonitorCompany(db, id);
}

/**
 * Delete a Ledger Health Monitor Company by ID.
 */
export async function deleteLedgerHealthMonitorCompany(db: any, id: string) {
  await db.delete(ledgerHealthMonitorCompany).where(eq(ledgerHealthMonitorCompany.id, id));
  return { deleted: true, id };
}
