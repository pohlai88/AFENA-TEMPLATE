import { z } from 'zod';

export const AssetMaintenanceTeamSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  maintenance_team_name: z.string(),
  maintenance_manager: z.string().optional(),
  maintenance_manager_name: z.string().optional(),
  company: z.string(),
  maintenance_team_members: z.array(z.unknown()),
});

export type AssetMaintenanceTeam = z.infer<typeof AssetMaintenanceTeamSchema>;

export const AssetMaintenanceTeamInsertSchema = AssetMaintenanceTeamSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMaintenanceTeamInsert = z.infer<typeof AssetMaintenanceTeamInsertSchema>;
