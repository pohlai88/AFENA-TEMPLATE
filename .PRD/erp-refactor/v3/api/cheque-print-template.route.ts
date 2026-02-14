// CRUD API handlers for Cheque Print Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { chequePrintTemplate } from '../db/schema.js';
import { ChequePrintTemplateSchema, ChequePrintTemplateInsertSchema } from '../types/cheque-print-template.js';

export const ROUTE_PREFIX = '/cheque-print-template';

/**
 * List Cheque Print Template records.
 */
export async function listChequePrintTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(chequePrintTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Cheque Print Template by ID.
 */
export async function getChequePrintTemplate(db: any, id: string) {
  const rows = await db.select().from(chequePrintTemplate).where(eq(chequePrintTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Cheque Print Template.
 */
export async function createChequePrintTemplate(db: any, data: unknown) {
  const parsed = ChequePrintTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(chequePrintTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Cheque Print Template.
 */
export async function updateChequePrintTemplate(db: any, id: string, data: unknown) {
  const parsed = ChequePrintTemplateInsertSchema.partial().parse(data);
  await db.update(chequePrintTemplate).set({ ...parsed, modified: new Date() }).where(eq(chequePrintTemplate.id, id));
  return getChequePrintTemplate(db, id);
}

/**
 * Delete a Cheque Print Template by ID.
 */
export async function deleteChequePrintTemplate(db: any, id: string) {
  await db.delete(chequePrintTemplate).where(eq(chequePrintTemplate.id, id));
  return { deleted: true, id };
}
