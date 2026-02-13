import { z } from 'zod';

export const QualityInspectionReadingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  specification: z.string(),
  parameter_group: z.string().optional(),
  status: z.enum(['Accepted', 'Rejected']).optional().default('Accepted'),
  value: z.string().optional(),
  numeric: z.boolean().optional().default(true),
  manual_inspection: z.boolean().optional().default(false),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  formula_based_criteria: z.boolean().optional().default(false),
  acceptance_formula: z.string().optional(),
  reading_value: z.string().optional(),
  reading_1: z.string().optional(),
  reading_2: z.string().optional(),
  reading_3: z.string().optional(),
  reading_4: z.string().optional(),
  reading_5: z.string().optional(),
  reading_6: z.string().optional(),
  reading_7: z.string().optional(),
  reading_8: z.string().optional(),
  reading_9: z.string().optional(),
  reading_10: z.string().optional(),
});

export type QualityInspectionReading = z.infer<typeof QualityInspectionReadingSchema>;

export const QualityInspectionReadingInsertSchema = QualityInspectionReadingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityInspectionReadingInsert = z.infer<typeof QualityInspectionReadingInsertSchema>;
