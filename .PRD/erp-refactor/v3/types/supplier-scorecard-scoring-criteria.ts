import { z } from 'zod';

export const SupplierScorecardScoringCriteriaSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  criteria_name: z.string(),
  score: z.number().optional(),
  weight: z.number(),
  max_score: z.number().optional().default(100),
  formula: z.string().optional(),
});

export type SupplierScorecardScoringCriteria = z.infer<typeof SupplierScorecardScoringCriteriaSchema>;

export const SupplierScorecardScoringCriteriaInsertSchema = SupplierScorecardScoringCriteriaSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardScoringCriteriaInsert = z.infer<typeof SupplierScorecardScoringCriteriaInsertSchema>;
