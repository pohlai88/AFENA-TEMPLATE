import { z } from 'zod';

export const ProductionPlanItemReferenceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_reference: z.string().optional(),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  qty: z.number().optional(),
});

export type ProductionPlanItemReference = z.infer<typeof ProductionPlanItemReferenceSchema>;

export const ProductionPlanItemReferenceInsertSchema = ProductionPlanItemReferenceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanItemReferenceInsert = z.infer<typeof ProductionPlanItemReferenceInsertSchema>;
