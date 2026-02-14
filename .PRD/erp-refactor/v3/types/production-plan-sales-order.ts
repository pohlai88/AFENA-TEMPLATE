import { z } from 'zod';

export const ProductionPlanSalesOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_order: z.string(),
  sales_order_date: z.string().optional(),
  customer: z.string().optional(),
  grand_total: z.number().optional(),
  status: z.string().optional(),
});

export type ProductionPlanSalesOrder = z.infer<typeof ProductionPlanSalesOrderSchema>;

export const ProductionPlanSalesOrderInsertSchema = ProductionPlanSalesOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanSalesOrderInsert = z.infer<typeof ProductionPlanSalesOrderInsertSchema>;
