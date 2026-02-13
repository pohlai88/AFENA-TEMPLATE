import { z } from 'zod';

export const MaintenanceTeamMemberSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  team_member: z.string(),
  full_name: z.string().optional(),
  maintenance_role: z.string(),
});

export type MaintenanceTeamMember = z.infer<typeof MaintenanceTeamMemberSchema>;

export const MaintenanceTeamMemberInsertSchema = MaintenanceTeamMemberSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceTeamMemberInsert = z.infer<typeof MaintenanceTeamMemberInsertSchema>;
