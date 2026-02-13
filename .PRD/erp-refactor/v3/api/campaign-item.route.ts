// CRUD API handlers for Campaign Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { campaignItem } from '../db/schema.js';
import { CampaignItemSchema, CampaignItemInsertSchema } from '../types/campaign-item.js';

export const ROUTE_PREFIX = '/campaign-item';

/**
 * List Campaign Item records.
 */
export async function listCampaignItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(campaignItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Campaign Item by ID.
 */
export async function getCampaignItem(db: any, id: string) {
  const rows = await db.select().from(campaignItem).where(eq(campaignItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Campaign Item.
 */
export async function createCampaignItem(db: any, data: unknown) {
  const parsed = CampaignItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(campaignItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Campaign Item.
 */
export async function updateCampaignItem(db: any, id: string, data: unknown) {
  const parsed = CampaignItemInsertSchema.partial().parse(data);
  await db.update(campaignItem).set({ ...parsed, modified: new Date() }).where(eq(campaignItem.id, id));
  return getCampaignItem(db, id);
}

/**
 * Delete a Campaign Item by ID.
 */
export async function deleteCampaignItem(db: any, id: string) {
  await db.delete(campaignItem).where(eq(campaignItem.id, id));
  return { deleted: true, id };
}
