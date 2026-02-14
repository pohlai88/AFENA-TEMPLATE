// CRUD API handlers for Financial Report Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { financialReportTemplate } from '../db/schema.js';
import { FinancialReportTemplateSchema, FinancialReportTemplateInsertSchema } from '../types/financial-report-template.js';

export const ROUTE_PREFIX = '/financial-report-template';

/**
 * List Financial Report Template records.
 */
export async function listFinancialReportTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(financialReportTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Financial Report Template by ID.
 */
export async function getFinancialReportTemplate(db: any, id: string) {
  const rows = await db.select().from(financialReportTemplate).where(eq(financialReportTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Financial Report Template.
 */
export async function createFinancialReportTemplate(db: any, data: unknown) {
  const parsed = FinancialReportTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(financialReportTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Financial Report Template.
 */
export async function updateFinancialReportTemplate(db: any, id: string, data: unknown) {
  const parsed = FinancialReportTemplateInsertSchema.partial().parse(data);
  await db.update(financialReportTemplate).set({ ...parsed, modified: new Date() }).where(eq(financialReportTemplate.id, id));
  return getFinancialReportTemplate(db, id);
}

/**
 * Delete a Financial Report Template by ID.
 */
export async function deleteFinancialReportTemplate(db: any, id: string) {
  await db.delete(financialReportTemplate).where(eq(financialReportTemplate.id, id));
  return { deleted: true, id };
}
