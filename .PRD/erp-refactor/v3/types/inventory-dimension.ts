import { z } from 'zod';

export const InventoryDimensionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  dimension_name: z.string(),
  reference_document: z.string(),
  disabled: z.boolean().optional().default(false),
  source_fieldname: z.string().optional(),
  target_fieldname: z.string().optional(),
  apply_to_all_doctypes: z.boolean().optional().default(true),
  validate_negative_stock: z.boolean().optional().default(false),
  document_type: z.string().optional(),
  type_of_transaction: z.enum(['Inward', 'Outward', 'Both']).optional(),
  fetch_from_parent: z.string().optional(),
  istable: z.boolean().optional().default(false),
  condition: z.string().optional(),
  reqd: z.boolean().optional().default(false),
  mandatory_depends_on: z.string().optional(),
  html_19: z.string().optional(),
});

export type InventoryDimension = z.infer<typeof InventoryDimensionSchema>;

export const InventoryDimensionInsertSchema = InventoryDimensionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type InventoryDimensionInsert = z.infer<typeof InventoryDimensionInsertSchema>;
