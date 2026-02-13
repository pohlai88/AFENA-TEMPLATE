import { z } from 'zod';

export const AssetMovementItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  asset: z.string(),
  source_location: z.string().optional(),
  from_employee: z.string().optional(),
  asset_name: z.string().optional(),
  target_location: z.string().optional(),
  to_employee: z.string().optional(),
});

export type AssetMovementItem = z.infer<typeof AssetMovementItemSchema>;

export const AssetMovementItemInsertSchema = AssetMovementItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMovementItemInsert = z.infer<typeof AssetMovementItemInsertSchema>;
