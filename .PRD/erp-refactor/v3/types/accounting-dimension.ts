import { z } from 'zod';

export const AccountingDimensionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.string(),
  label: z.string().optional(),
  fieldname: z.string().optional(),
  dimension_defaults: z.array(z.unknown()).optional(),
  disabled: z.boolean().optional().default(false),
});

export type AccountingDimension = z.infer<typeof AccountingDimensionSchema>;

export const AccountingDimensionInsertSchema = AccountingDimensionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountingDimensionInsert = z.infer<typeof AccountingDimensionInsertSchema>;
