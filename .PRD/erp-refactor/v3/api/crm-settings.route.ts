// CRUD API handlers for CRM Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { crmSettings } from '../db/schema.js';
import { CrmSettingsSchema, CrmSettingsInsertSchema } from '../types/crm-settings.js';

export const ROUTE_PREFIX = '/crm-settings';

/**
 * List CRM Settings records.
 */
export async function listCrmSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(crmSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single CRM Settings by ID.
 */
export async function getCrmSettings(db: any, id: string) {
  const rows = await db.select().from(crmSettings).where(eq(crmSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new CRM Settings.
 */
export async function createCrmSettings(db: any, data: unknown) {
  const parsed = CrmSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(crmSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing CRM Settings.
 */
export async function updateCrmSettings(db: any, id: string, data: unknown) {
  const parsed = CrmSettingsInsertSchema.partial().parse(data);
  await db.update(crmSettings).set({ ...parsed, modified: new Date() }).where(eq(crmSettings.id, id));
  return getCrmSettings(db, id);
}

/**
 * Delete a CRM Settings by ID.
 */
export async function deleteCrmSettings(db: any, id: string) {
  await db.delete(crmSettings).where(eq(crmSettings.id, id));
  return { deleted: true, id };
}
