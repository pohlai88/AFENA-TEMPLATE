// CRUD API handlers for Asset Maintenance Team
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetMaintenanceTeam } from '../db/schema.js';
import { AssetMaintenanceTeamSchema, AssetMaintenanceTeamInsertSchema } from '../types/asset-maintenance-team.js';

export const ROUTE_PREFIX = '/asset-maintenance-team';

/**
 * List Asset Maintenance Team records.
 */
export async function listAssetMaintenanceTeam(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetMaintenanceTeam).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Maintenance Team by ID.
 */
export async function getAssetMaintenanceTeam(db: any, id: string) {
  const rows = await db.select().from(assetMaintenanceTeam).where(eq(assetMaintenanceTeam.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Maintenance Team.
 */
export async function createAssetMaintenanceTeam(db: any, data: unknown) {
  const parsed = AssetMaintenanceTeamInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetMaintenanceTeam).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Maintenance Team.
 */
export async function updateAssetMaintenanceTeam(db: any, id: string, data: unknown) {
  const parsed = AssetMaintenanceTeamInsertSchema.partial().parse(data);
  await db.update(assetMaintenanceTeam).set({ ...parsed, modified: new Date() }).where(eq(assetMaintenanceTeam.id, id));
  return getAssetMaintenanceTeam(db, id);
}

/**
 * Delete a Asset Maintenance Team by ID.
 */
export async function deleteAssetMaintenanceTeam(db: any, id: string) {
  await db.delete(assetMaintenanceTeam).where(eq(assetMaintenanceTeam.id, id));
  return { deleted: true, id };
}
