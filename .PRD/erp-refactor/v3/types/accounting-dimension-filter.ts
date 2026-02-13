import { z } from 'zod';

export const AccountingDimensionFilterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  accounting_dimension: z.string(),
  fieldname: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  company: z.string(),
  apply_restriction_on_values: z.boolean().optional().default(true),
  allow_or_restrict: z.enum(['Allow', 'Restrict']),
  accounts: z.array(z.unknown()),
  dimensions: z.array(z.unknown()).optional(),
  dimension_filter_help: z.string().optional(),
});

export type AccountingDimensionFilter = z.infer<typeof AccountingDimensionFilterSchema>;

export const AccountingDimensionFilterInsertSchema = AccountingDimensionFilterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountingDimensionFilterInsert = z.infer<typeof AccountingDimensionFilterInsertSchema>;
