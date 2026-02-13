// CRUD API handlers for Email Campaign
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { emailCampaign } from '../db/schema.js';
import { EmailCampaignSchema, EmailCampaignInsertSchema } from '../types/email-campaign.js';

export const ROUTE_PREFIX = '/email-campaign';

/**
 * List Email Campaign records.
 */
export async function listEmailCampaign(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(emailCampaign).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Email Campaign by ID.
 */
export async function getEmailCampaign(db: any, id: string) {
  const rows = await db.select().from(emailCampaign).where(eq(emailCampaign.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Email Campaign.
 */
export async function createEmailCampaign(db: any, data: unknown) {
  const parsed = EmailCampaignInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(emailCampaign).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Email Campaign.
 */
export async function updateEmailCampaign(db: any, id: string, data: unknown) {
  const parsed = EmailCampaignInsertSchema.partial().parse(data);
  await db.update(emailCampaign).set({ ...parsed, modified: new Date() }).where(eq(emailCampaign.id, id));
  return getEmailCampaign(db, id);
}

/**
 * Delete a Email Campaign by ID.
 */
export async function deleteEmailCampaign(db: any, id: string) {
  await db.delete(emailCampaign).where(eq(emailCampaign.id, id));
  return { deleted: true, id };
}
