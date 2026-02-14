import { z } from 'zod';

export const SupplierScorecardVariableSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  variable_label: z.string(),
  is_custom: z.boolean().optional().default(false),
  param_name: z.string(),
  path: z.string(),
  description: z.string().optional(),
});

export type SupplierScorecardVariable = z.infer<typeof SupplierScorecardVariableSchema>;

export const SupplierScorecardVariableInsertSchema = SupplierScorecardVariableSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardVariableInsert = z.infer<typeof SupplierScorecardVariableInsertSchema>;
