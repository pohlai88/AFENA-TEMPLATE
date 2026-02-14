import { z } from 'zod';

export const FiscalYearSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  year: z.string(),
  disabled: z.boolean().optional().default(false),
  is_short_year: z.boolean().optional().default(false),
  year_start_date: z.string(),
  year_end_date: z.string(),
  companies: z.array(z.unknown()).optional(),
  auto_created: z.boolean().optional().default(false),
});

export type FiscalYear = z.infer<typeof FiscalYearSchema>;

export const FiscalYearInsertSchema = FiscalYearSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type FiscalYearInsert = z.infer<typeof FiscalYearInsertSchema>;
