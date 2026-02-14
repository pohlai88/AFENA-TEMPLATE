// CRUD API handlers for Campaign Email Schedule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { campaignEmailSchedule } from '../db/schema.js';
import { CampaignEmailScheduleSchema, CampaignEmailScheduleInsertSchema } from '../types/campaign-email-schedule.js';

export const ROUTE_PREFIX = '/campaign-email-schedule';

/**
 * List Campaign Email Schedule records.
 */
export async function listCampaignEmailSchedule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(campaignEmailSchedule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Campaign Email Schedule by ID.
 */
export async function getCampaignEmailSchedule(db: any, id: string) {
  const rows = await db.select().from(campaignEmailSchedule).where(eq(campaignEmailSchedule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Campaign Email Schedule.
 */
export async function createCampaignEmailSchedule(db: any, data: unknown) {
  const parsed = CampaignEmailScheduleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(campaignEmailSchedule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Campaign Email Schedule.
 */
export async function updateCampaignEmailSchedule(db: any, id: string, data: unknown) {
  const parsed = CampaignEmailScheduleInsertSchema.partial().parse(data);
  await db.update(campaignEmailSchedule).set({ ...parsed, modified: new Date() }).where(eq(campaignEmailSchedule.id, id));
  return getCampaignEmailSchedule(db, id);
}

/**
 * Delete a Campaign Email Schedule by ID.
 */
export async function deleteCampaignEmailSchedule(db: any, id: string) {
  await db.delete(campaignEmailSchedule).where(eq(campaignEmailSchedule.id, id));
  return { deleted: true, id };
}
