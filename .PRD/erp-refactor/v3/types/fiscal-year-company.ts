import { z } from 'zod';

export const FiscalYearCompanySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
});

export type FiscalYearCompany = z.infer<typeof FiscalYearCompanySchema>;

export const FiscalYearCompanyInsertSchema = FiscalYearCompanySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type FiscalYearCompanyInsert = z.infer<typeof FiscalYearCompanyInsertSchema>;
