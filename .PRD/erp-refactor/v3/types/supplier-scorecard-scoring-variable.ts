import { z } from 'zod';

export const SupplierScorecardScoringVariableSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  variable_label: z.string(),
  description: z.string().optional(),
  value: z.number().optional(),
  param_name: z.string().optional(),
  path: z.string().optional(),
});

export type SupplierScorecardScoringVariable = z.infer<typeof SupplierScorecardScoringVariableSchema>;

export const SupplierScorecardScoringVariableInsertSchema = SupplierScorecardScoringVariableSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardScoringVariableInsert = z.infer<typeof SupplierScorecardScoringVariableInsertSchema>;
