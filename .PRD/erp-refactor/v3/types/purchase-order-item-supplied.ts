import { z } from 'zod';

export const PurchaseOrderItemSuppliedSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  main_item_code: z.string().optional(),
  rm_item_code: z.string().optional(),
  stock_uom: z.string().optional(),
  reserve_warehouse: z.string().optional(),
  conversion_factor: z.number().optional(),
  bom_detail_no: z.string().optional(),
  reference_name: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  required_qty: z.number().optional(),
  supplied_qty: z.number().optional(),
  consumed_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  total_supplied_qty: z.number().optional(),
});

export type PurchaseOrderItemSupplied = z.infer<typeof PurchaseOrderItemSuppliedSchema>;

export const PurchaseOrderItemSuppliedInsertSchema = PurchaseOrderItemSuppliedSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseOrderItemSuppliedInsert = z.infer<typeof PurchaseOrderItemSuppliedInsertSchema>;
