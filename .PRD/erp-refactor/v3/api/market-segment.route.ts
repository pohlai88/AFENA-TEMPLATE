// CRUD API handlers for Market Segment
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { marketSegment } from '../db/schema.js';
import { MarketSegmentSchema, MarketSegmentInsertSchema } from '../types/market-segment.js';

export const ROUTE_PREFIX = '/market-segment';

/**
 * List Market Segment records.
 */
export async function listMarketSegment(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(marketSegment).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Market Segment by ID.
 */
export async function getMarketSegment(db: any, id: string) {
  const rows = await db.select().from(marketSegment).where(eq(marketSegment.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Market Segment.
 */
export async function createMarketSegment(db: any, data: unknown) {
  const parsed = MarketSegmentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(marketSegment).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Market Segment.
 */
export async function updateMarketSegment(db: any, id: string, data: unknown) {
  const parsed = MarketSegmentInsertSchema.partial().parse(data);
  await db.update(marketSegment).set({ ...parsed, modified: new Date() }).where(eq(marketSegment.id, id));
  return getMarketSegment(db, id);
}

/**
 * Delete a Market Segment by ID.
 */
export async function deleteMarketSegment(db: any, id: string) {
  await db.delete(marketSegment).where(eq(marketSegment.id, id));
  return { deleted: true, id };
}
