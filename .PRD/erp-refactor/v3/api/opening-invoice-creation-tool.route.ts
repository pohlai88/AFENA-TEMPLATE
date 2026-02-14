// CRUD API handlers for Opening Invoice Creation Tool
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { openingInvoiceCreationTool } from '../db/schema.js';
import { OpeningInvoiceCreationToolSchema, OpeningInvoiceCreationToolInsertSchema } from '../types/opening-invoice-creation-tool.js';

export const ROUTE_PREFIX = '/opening-invoice-creation-tool';

/**
 * List Opening Invoice Creation Tool records.
 */
export async function listOpeningInvoiceCreationTool(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(openingInvoiceCreationTool).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Opening Invoice Creation Tool by ID.
 */
export async function getOpeningInvoiceCreationTool(db: any, id: string) {
  const rows = await db.select().from(openingInvoiceCreationTool).where(eq(openingInvoiceCreationTool.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Opening Invoice Creation Tool.
 */
export async function createOpeningInvoiceCreationTool(db: any, data: unknown) {
  const parsed = OpeningInvoiceCreationToolInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(openingInvoiceCreationTool).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Opening Invoice Creation Tool.
 */
export async function updateOpeningInvoiceCreationTool(db: any, id: string, data: unknown) {
  const parsed = OpeningInvoiceCreationToolInsertSchema.partial().parse(data);
  await db.update(openingInvoiceCreationTool).set({ ...parsed, modified: new Date() }).where(eq(openingInvoiceCreationTool.id, id));
  return getOpeningInvoiceCreationTool(db, id);
}

/**
 * Delete a Opening Invoice Creation Tool by ID.
 */
export async function deleteOpeningInvoiceCreationTool(db: any, id: string) {
  await db.delete(openingInvoiceCreationTool).where(eq(openingInvoiceCreationTool.id, id));
  return { deleted: true, id };
}
