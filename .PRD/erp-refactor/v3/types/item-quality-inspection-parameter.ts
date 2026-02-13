import { z } from 'zod';

export const ItemQualityInspectionParameterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  specification: z.string(),
  parameter_group: z.string().optional(),
  value: z.string().optional(),
  numeric: z.boolean().optional().default(true),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  formula_based_criteria: z.boolean().optional().default(false),
  acceptance_formula: z.string().optional(),
});

export type ItemQualityInspectionParameter = z.infer<typeof ItemQualityInspectionParameterSchema>;

export const ItemQualityInspectionParameterInsertSchema = ItemQualityInspectionParameterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemQualityInspectionParameterInsert = z.infer<typeof ItemQualityInspectionParameterInsertSchema>;
