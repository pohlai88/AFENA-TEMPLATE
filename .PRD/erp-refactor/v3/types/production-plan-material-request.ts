import { z } from 'zod';

export const ProductionPlanMaterialRequestSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  material_request: z.string(),
  material_request_date: z.string().optional(),
});

export type ProductionPlanMaterialRequest = z.infer<typeof ProductionPlanMaterialRequestSchema>;

export const ProductionPlanMaterialRequestInsertSchema = ProductionPlanMaterialRequestSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanMaterialRequestInsert = z.infer<typeof ProductionPlanMaterialRequestInsertSchema>;
