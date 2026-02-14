// CRUD API handlers for Maintenance Team Member
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { maintenanceTeamMember } from '../db/schema.js';
import { MaintenanceTeamMemberSchema, MaintenanceTeamMemberInsertSchema } from '../types/maintenance-team-member.js';

export const ROUTE_PREFIX = '/maintenance-team-member';

/**
 * List Maintenance Team Member records.
 */
export async function listMaintenanceTeamMember(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(maintenanceTeamMember).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Maintenance Team Member by ID.
 */
export async function getMaintenanceTeamMember(db: any, id: string) {
  const rows = await db.select().from(maintenanceTeamMember).where(eq(maintenanceTeamMember.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Maintenance Team Member.
 */
export async function createMaintenanceTeamMember(db: any, data: unknown) {
  const parsed = MaintenanceTeamMemberInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(maintenanceTeamMember).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Maintenance Team Member.
 */
export async function updateMaintenanceTeamMember(db: any, id: string, data: unknown) {
  const parsed = MaintenanceTeamMemberInsertSchema.partial().parse(data);
  await db.update(maintenanceTeamMember).set({ ...parsed, modified: new Date() }).where(eq(maintenanceTeamMember.id, id));
  return getMaintenanceTeamMember(db, id);
}

/**
 * Delete a Maintenance Team Member by ID.
 */
export async function deleteMaintenanceTeamMember(db: any, id: string) {
  await db.delete(maintenanceTeamMember).where(eq(maintenanceTeamMember.id, id));
  return { deleted: true, id };
}
