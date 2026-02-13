import { z } from 'zod';

export const ProductionPlanMaterialRequestWarehouseSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  warehouse: z.string().optional(),
});

export type ProductionPlanMaterialRequestWarehouse = z.infer<typeof ProductionPlanMaterialRequestWarehouseSchema>;

export const ProductionPlanMaterialRequestWarehouseInsertSchema = ProductionPlanMaterialRequestWarehouseSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanMaterialRequestWarehouseInsert = z.infer<typeof ProductionPlanMaterialRequestWarehouseInsertSchema>;
