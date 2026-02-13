// CRUD API handlers for Campaign
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { campaign } from '../db/schema.js';
import { CampaignSchema, CampaignInsertSchema } from '../types/campaign.js';

export const ROUTE_PREFIX = '/campaign';

/**
 * List Campaign records.
 */
export async function listCampaign(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(campaign).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Campaign by ID.
 */
export async function getCampaign(db: any, id: string) {
  const rows = await db.select().from(campaign).where(eq(campaign.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Campaign.
 */
export async function createCampaign(db: any, data: unknown) {
  const parsed = CampaignInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(campaign).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Campaign.
 */
export async function updateCampaign(db: any, id: string, data: unknown) {
  const parsed = CampaignInsertSchema.partial().parse(data);
  await db.update(campaign).set({ ...parsed, modified: new Date() }).where(eq(campaign.id, id));
  return getCampaign(db, id);
}

/**
 * Delete a Campaign by ID.
 */
export async function deleteCampaign(db: any, id: string) {
  await db.delete(campaign).where(eq(campaign.id, id));
  return { deleted: true, id };
}
