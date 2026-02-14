// CRUD API handlers for Subcontracting Inward Order Service Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingInwardOrderServiceItem } from '../db/schema.js';
import { SubcontractingInwardOrderServiceItemSchema, SubcontractingInwardOrderServiceItemInsertSchema } from '../types/subcontracting-inward-order-service-item.js';

export const ROUTE_PREFIX = '/subcontracting-inward-order-service-item';

/**
 * List Subcontracting Inward Order Service Item records.
 */
export async function listSubcontractingInwardOrderServiceItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingInwardOrderServiceItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Inward Order Service Item by ID.
 */
export async function getSubcontractingInwardOrderServiceItem(db: any, id: string) {
  const rows = await db.select().from(subcontractingInwardOrderServiceItem).where(eq(subcontractingInwardOrderServiceItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Inward Order Service Item.
 */
export async function createSubcontractingInwardOrderServiceItem(db: any, data: unknown) {
  const parsed = SubcontractingInwardOrderServiceItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingInwardOrderServiceItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Inward Order Service Item.
 */
export async function updateSubcontractingInwardOrderServiceItem(db: any, id: string, data: unknown) {
  const parsed = SubcontractingInwardOrderServiceItemInsertSchema.partial().parse(data);
  await db.update(subcontractingInwardOrderServiceItem).set({ ...parsed, modified: new Date() }).where(eq(subcontractingInwardOrderServiceItem.id, id));
  return getSubcontractingInwardOrderServiceItem(db, id);
}

/**
 * Delete a Subcontracting Inward Order Service Item by ID.
 */
export async function deleteSubcontractingInwardOrderServiceItem(db: any, id: string) {
  await db.delete(subcontractingInwardOrderServiceItem).where(eq(subcontractingInwardOrderServiceItem.id, id));
  return { deleted: true, id };
}
