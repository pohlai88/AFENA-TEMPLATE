import { z } from 'zod';

export const SubcontractingInwardOrderReceivedItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  main_item_code: z.string(),
  rm_item_code: z.string(),
  is_customer_provided_item: z.boolean().default(false),
  is_additional_item: z.boolean().optional().default(false),
  stock_uom: z.string(),
  warehouse: z.string().optional(),
  bom_detail_no: z.string().optional(),
  reference_name: z.string(),
  required_qty: z.number().optional().default(0),
  billed_qty: z.number().optional().default(0),
  received_qty: z.number().optional().default(0),
  consumed_qty: z.number().optional().default(0),
  work_order_qty: z.number().optional().default(0),
  returned_qty: z.number().optional().default(0),
  rate: z.number().optional().default(0),
});

export type SubcontractingInwardOrderReceivedItem = z.infer<typeof SubcontractingInwardOrderReceivedItemSchema>;

export const SubcontractingInwardOrderReceivedItemInsertSchema = SubcontractingInwardOrderReceivedItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingInwardOrderReceivedItemInsert = z.infer<typeof SubcontractingInwardOrderReceivedItemInsertSchema>;
