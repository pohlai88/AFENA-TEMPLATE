import { z } from 'zod';

export const SupplierScorecardScoringStandingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  standing_name: z.string().optional(),
  standing_color: z.enum(['Blue', 'Purple', 'Green', 'Yellow', 'Orange', 'Red']).optional(),
  min_grade: z.number().optional(),
  max_grade: z.number().optional(),
  warn_rfqs: z.boolean().optional().default(false),
  warn_pos: z.boolean().optional().default(false),
  prevent_rfqs: z.boolean().optional().default(false),
  prevent_pos: z.boolean().optional().default(false),
  notify_supplier: z.boolean().optional().default(false),
  notify_employee: z.boolean().optional().default(false),
  employee_link: z.string().optional(),
});

export type SupplierScorecardScoringStanding = z.infer<typeof SupplierScorecardScoringStandingSchema>;

export const SupplierScorecardScoringStandingInsertSchema = SupplierScorecardScoringStandingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardScoringStandingInsert = z.infer<typeof SupplierScorecardScoringStandingInsertSchema>;
