// CRUD API handlers for Opening Invoice Creation Tool Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { openingInvoiceCreationToolItem } from '../db/schema.js';
import { OpeningInvoiceCreationToolItemSchema, OpeningInvoiceCreationToolItemInsertSchema } from '../types/opening-invoice-creation-tool-item.js';

export const ROUTE_PREFIX = '/opening-invoice-creation-tool-item';

/**
 * List Opening Invoice Creation Tool Item records.
 */
export async function listOpeningInvoiceCreationToolItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(openingInvoiceCreationToolItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Opening Invoice Creation Tool Item by ID.
 */
export async function getOpeningInvoiceCreationToolItem(db: any, id: string) {
  const rows = await db.select().from(openingInvoiceCreationToolItem).where(eq(openingInvoiceCreationToolItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Opening Invoice Creation Tool Item.
 */
export async function createOpeningInvoiceCreationToolItem(db: any, data: unknown) {
  const parsed = OpeningInvoiceCreationToolItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(openingInvoiceCreationToolItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Opening Invoice Creation Tool Item.
 */
export async function updateOpeningInvoiceCreationToolItem(db: any, id: string, data: unknown) {
  const parsed = OpeningInvoiceCreationToolItemInsertSchema.partial().parse(data);
  await db.update(openingInvoiceCreationToolItem).set({ ...parsed, modified: new Date() }).where(eq(openingInvoiceCreationToolItem.id, id));
  return getOpeningInvoiceCreationToolItem(db, id);
}

/**
 * Delete a Opening Invoice Creation Tool Item by ID.
 */
export async function deleteOpeningInvoiceCreationToolItem(db: any, id: string) {
  await db.delete(openingInvoiceCreationToolItem).where(eq(openingInvoiceCreationToolItem.id, id));
  return { deleted: true, id };
}
