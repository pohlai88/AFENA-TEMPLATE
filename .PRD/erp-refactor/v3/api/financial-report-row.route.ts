// CRUD API handlers for Financial Report Row
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { financialReportRow } from '../db/schema.js';
import { FinancialReportRowSchema, FinancialReportRowInsertSchema } from '../types/financial-report-row.js';

export const ROUTE_PREFIX = '/financial-report-row';

/**
 * List Financial Report Row records.
 */
export async function listFinancialReportRow(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(financialReportRow).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Financial Report Row by ID.
 */
export async function getFinancialReportRow(db: any, id: string) {
  const rows = await db.select().from(financialReportRow).where(eq(financialReportRow.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Financial Report Row.
 */
export async function createFinancialReportRow(db: any, data: unknown) {
  const parsed = FinancialReportRowInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(financialReportRow).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Financial Report Row.
 */
export async function updateFinancialReportRow(db: any, id: string, data: unknown) {
  const parsed = FinancialReportRowInsertSchema.partial().parse(data);
  await db.update(financialReportRow).set({ ...parsed, modified: new Date() }).where(eq(financialReportRow.id, id));
  return getFinancialReportRow(db, id);
}

/**
 * Delete a Financial Report Row by ID.
 */
export async function deleteFinancialReportRow(db: any, id: string) {
  await db.delete(financialReportRow).where(eq(financialReportRow.id, id));
  return { deleted: true, id };
}
