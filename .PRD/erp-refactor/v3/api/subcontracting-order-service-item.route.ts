// CRUD API handlers for Subcontracting Order Service Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingOrderServiceItem } from '../db/schema.js';
import { SubcontractingOrderServiceItemSchema, SubcontractingOrderServiceItemInsertSchema } from '../types/subcontracting-order-service-item.js';

export const ROUTE_PREFIX = '/subcontracting-order-service-item';

/**
 * List Subcontracting Order Service Item records.
 */
export async function listSubcontractingOrderServiceItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingOrderServiceItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Order Service Item by ID.
 */
export async function getSubcontractingOrderServiceItem(db: any, id: string) {
  const rows = await db.select().from(subcontractingOrderServiceItem).where(eq(subcontractingOrderServiceItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Order Service Item.
 */
export async function createSubcontractingOrderServiceItem(db: any, data: unknown) {
  const parsed = SubcontractingOrderServiceItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingOrderServiceItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Order Service Item.
 */
export async function updateSubcontractingOrderServiceItem(db: any, id: string, data: unknown) {
  const parsed = SubcontractingOrderServiceItemInsertSchema.partial().parse(data);
  await db.update(subcontractingOrderServiceItem).set({ ...parsed, modified: new Date() }).where(eq(subcontractingOrderServiceItem.id, id));
  return getSubcontractingOrderServiceItem(db, id);
}

/**
 * Delete a Subcontracting Order Service Item by ID.
 */
export async function deleteSubcontractingOrderServiceItem(db: any, id: string) {
  await db.delete(subcontractingOrderServiceItem).where(eq(subcontractingOrderServiceItem.id, id));
  return { deleted: true, id };
}
