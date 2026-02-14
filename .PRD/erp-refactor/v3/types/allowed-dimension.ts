import { z } from 'zod';

export const AllowedDimensionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  accounting_dimension: z.string().optional(),
  dimension_value: z.string().optional(),
});

export type AllowedDimension = z.infer<typeof AllowedDimensionSchema>;

export const AllowedDimensionInsertSchema = AllowedDimensionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AllowedDimensionInsert = z.infer<typeof AllowedDimensionInsertSchema>;
