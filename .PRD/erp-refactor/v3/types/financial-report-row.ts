import { z } from 'zod';

export const FinancialReportRowSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_code: z.string().optional(),
  display_name: z.string().optional(),
  indentation_level: z.number().int().optional(),
  data_source: z.enum(['Account Data', 'Calculated Amount', 'Custom API', 'Blank Line', 'Column Break', 'Section Break']).optional(),
  balance_type: z.enum(['Opening Balance', 'Closing Balance', 'Period Movement (Debits - Credits)']).optional(),
  fieldtype: z.enum(['Currency', 'Float', 'Int', 'Percent']).optional(),
  color: z.string().optional(),
  bold_text: z.boolean().optional().default(false),
  italic_text: z.boolean().optional().default(false),
  hidden_calculation: z.boolean().optional().default(false),
  hide_when_empty: z.boolean().optional().default(false),
  reverse_sign: z.boolean().optional().default(false),
  include_in_charts: z.boolean().optional().default(false),
  advanced_filtering: z.boolean().optional().default(false),
  filters_editor: z.string().optional(),
  calculation_formula: z.string().optional(),
  formula_description: z.string().optional(),
});

export type FinancialReportRow = z.infer<typeof FinancialReportRowSchema>;

export const FinancialReportRowInsertSchema = FinancialReportRowSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type FinancialReportRowInsert = z.infer<typeof FinancialReportRowInsertSchema>;
