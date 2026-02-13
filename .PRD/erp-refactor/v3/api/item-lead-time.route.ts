// CRUD API handlers for Item Lead Time
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemLeadTime } from '../db/schema.js';
import { ItemLeadTimeSchema, ItemLeadTimeInsertSchema } from '../types/item-lead-time.js';

export const ROUTE_PREFIX = '/item-lead-time';

/**
 * List Item Lead Time records.
 */
export async function listItemLeadTime(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemLeadTime).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Lead Time by ID.
 */
export async function getItemLeadTime(db: any, id: string) {
  const rows = await db.select().from(itemLeadTime).where(eq(itemLeadTime.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Lead Time.
 */
export async function createItemLeadTime(db: any, data: unknown) {
  const parsed = ItemLeadTimeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemLeadTime).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Lead Time.
 */
export async function updateItemLeadTime(db: any, id: string, data: unknown) {
  const parsed = ItemLeadTimeInsertSchema.partial().parse(data);
  await db.update(itemLeadTime).set({ ...parsed, modified: new Date() }).where(eq(itemLeadTime.id, id));
  return getItemLeadTime(db, id);
}

/**
 * Delete a Item Lead Time by ID.
 */
export async function deleteItemLeadTime(db: any, id: string) {
  await db.delete(itemLeadTime).where(eq(itemLeadTime.id, id));
  return { deleted: true, id };
}
