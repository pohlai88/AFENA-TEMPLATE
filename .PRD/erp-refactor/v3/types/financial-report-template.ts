import { z } from 'zod';

export const FinancialReportTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  template_name: z.string(),
  report_type: z.enum(['Profit and Loss Statement', 'Balance Sheet', 'Cash Flow', 'Custom Financial Statement']).optional(),
  module: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  rows: z.array(z.unknown()).optional(),
});

export type FinancialReportTemplate = z.infer<typeof FinancialReportTemplateSchema>;

export const FinancialReportTemplateInsertSchema = FinancialReportTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type FinancialReportTemplateInsert = z.infer<typeof FinancialReportTemplateInsertSchema>;
