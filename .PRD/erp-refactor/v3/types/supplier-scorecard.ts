import { z } from 'zod';

export const SupplierScorecardSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier: z.string().optional(),
  supplier_score: z.string().optional(),
  indicator_color: z.string().optional(),
  status: z.string().optional(),
  period: z.enum(['Per Week', 'Per Month', 'Per Year']).default('Per Month'),
  weighting_function: z.string().default('{total_score} * max( 0, min ( 1 , (12 - {period_number}) / 12) )'),
  standings: z.array(z.unknown()),
  criteria: z.array(z.unknown()),
  warn_rfqs: z.boolean().optional().default(false),
  warn_pos: z.boolean().optional().default(false),
  prevent_rfqs: z.boolean().optional().default(false),
  prevent_pos: z.boolean().optional().default(false),
  notify_supplier: z.boolean().optional().default(false),
  notify_employee: z.boolean().optional().default(false),
  employee: z.string().optional(),
});

export type SupplierScorecard = z.infer<typeof SupplierScorecardSchema>;

export const SupplierScorecardInsertSchema = SupplierScorecardSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardInsert = z.infer<typeof SupplierScorecardInsertSchema>;
