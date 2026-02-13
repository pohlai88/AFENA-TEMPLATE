import { z } from 'zod';

export const SubcontractingOrderSuppliedItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  main_item_code: z.string().optional(),
  rm_item_code: z.string().optional(),
  stock_uom: z.string().optional(),
  conversion_factor: z.number().optional().default(1),
  reserve_warehouse: z.string().optional(),
  bom_detail_no: z.string().optional(),
  reference_name: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  required_qty: z.number().optional(),
  supplied_qty: z.number().optional(),
  stock_reserved_qty: z.number().optional().default(0),
  consumed_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  total_supplied_qty: z.number().optional(),
});

export type SubcontractingOrderSuppliedItem = z.infer<typeof SubcontractingOrderSuppliedItemSchema>;

export const SubcontractingOrderSuppliedItemInsertSchema = SubcontractingOrderSuppliedItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingOrderSuppliedItemInsert = z.infer<typeof SubcontractingOrderSuppliedItemInsertSchema>;
