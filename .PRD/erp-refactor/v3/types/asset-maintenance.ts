import { z } from 'zod';

export const AssetMaintenanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  asset_name: z.string(),
  asset_category: z.string().optional(),
  company: z.string(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  maintenance_team: z.string(),
  maintenance_manager: z.string().optional(),
  maintenance_manager_name: z.string().optional(),
  asset_maintenance_tasks: z.array(z.unknown()),
});

export type AssetMaintenance = z.infer<typeof AssetMaintenanceSchema>;

export const AssetMaintenanceInsertSchema = AssetMaintenanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMaintenanceInsert = z.infer<typeof AssetMaintenanceInsertSchema>;
