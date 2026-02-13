// CRUD API handlers for Subcontracting Inward Order Scrap Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingInwardOrderScrapItem } from '../db/schema.js';
import { SubcontractingInwardOrderScrapItemSchema, SubcontractingInwardOrderScrapItemInsertSchema } from '../types/subcontracting-inward-order-scrap-item.js';

export const ROUTE_PREFIX = '/subcontracting-inward-order-scrap-item';

/**
 * List Subcontracting Inward Order Scrap Item records.
 */
export async function listSubcontractingInwardOrderScrapItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingInwardOrderScrapItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Inward Order Scrap Item by ID.
 */
export async function getSubcontractingInwardOrderScrapItem(db: any, id: string) {
  const rows = await db.select().from(subcontractingInwardOrderScrapItem).where(eq(subcontractingInwardOrderScrapItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Inward Order Scrap Item.
 */
export async function createSubcontractingInwardOrderScrapItem(db: any, data: unknown) {
  const parsed = SubcontractingInwardOrderScrapItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingInwardOrderScrapItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Inward Order Scrap Item.
 */
export async function updateSubcontractingInwardOrderScrapItem(db: any, id: string, data: unknown) {
  const parsed = SubcontractingInwardOrderScrapItemInsertSchema.partial().parse(data);
  await db.update(subcontractingInwardOrderScrapItem).set({ ...parsed, modified: new Date() }).where(eq(subcontractingInwardOrderScrapItem.id, id));
  return getSubcontractingInwardOrderScrapItem(db, id);
}

/**
 * Delete a Subcontracting Inward Order Scrap Item by ID.
 */
export async function deleteSubcontractingInwardOrderScrapItem(db: any, id: string) {
  await db.delete(subcontractingInwardOrderScrapItem).where(eq(subcontractingInwardOrderScrapItem.id, id));
  return { deleted: true, id };
}
