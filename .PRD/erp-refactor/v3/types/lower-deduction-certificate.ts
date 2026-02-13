import { z } from 'zod';

export const LowerDeductionCertificateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  tax_withholding_category: z.string(),
  fiscal_year: z.string(),
  company: z.string(),
  certificate_no: z.string(),
  supplier: z.string(),
  pan_no: z.string(),
  valid_from: z.string(),
  valid_upto: z.string(),
  rate: z.number(),
  certificate_limit: z.number(),
});

export type LowerDeductionCertificate = z.infer<typeof LowerDeductionCertificateSchema>;

export const LowerDeductionCertificateInsertSchema = LowerDeductionCertificateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LowerDeductionCertificateInsert = z.infer<typeof LowerDeductionCertificateInsertSchema>;
