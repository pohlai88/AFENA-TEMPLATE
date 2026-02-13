import { z } from 'zod';

export const SupplierScorecardPeriodSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  supplier: z.string(),
  naming_series: z.enum(['PU-SSP-.YYYY.-']),
  total_score: z.number().optional(),
  start_date: z.string(),
  end_date: z.string(),
  criteria: z.array(z.unknown()),
  variables: z.array(z.unknown()).optional(),
  scorecard: z.string(),
  amended_from: z.string().optional(),
});

export type SupplierScorecardPeriod = z.infer<typeof SupplierScorecardPeriodSchema>;

export const SupplierScorecardPeriodInsertSchema = SupplierScorecardPeriodSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardPeriodInsert = z.infer<typeof SupplierScorecardPeriodInsertSchema>;
