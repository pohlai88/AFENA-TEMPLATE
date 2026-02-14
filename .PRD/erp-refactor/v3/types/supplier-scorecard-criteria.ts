import { z } from 'zod';

export const SupplierScorecardCriteriaSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  criteria_name: z.string(),
  max_score: z.number().default(100),
  formula: z.string(),
  weight: z.number().optional(),
});

export type SupplierScorecardCriteria = z.infer<typeof SupplierScorecardCriteriaSchema>;

export const SupplierScorecardCriteriaInsertSchema = SupplierScorecardCriteriaSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardCriteriaInsert = z.infer<typeof SupplierScorecardCriteriaInsertSchema>;
