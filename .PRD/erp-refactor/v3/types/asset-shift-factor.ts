import { z } from 'zod';

export const AssetShiftFactorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  shift_name: z.string(),
  shift_factor: z.number(),
  default: z.boolean().optional().default(false),
});

export type AssetShiftFactor = z.infer<typeof AssetShiftFactorSchema>;

export const AssetShiftFactorInsertSchema = AssetShiftFactorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetShiftFactorInsert = z.infer<typeof AssetShiftFactorInsertSchema>;
