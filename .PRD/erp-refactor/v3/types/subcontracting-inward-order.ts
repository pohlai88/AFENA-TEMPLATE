import { z } from 'zod';

export const SubcontractingInwardOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional().default('{customer_name}'),
  naming_series: z.enum(['SCI-ORD-.YYYY.-']),
  sales_order: z.string(),
  customer: z.string(),
  customer_name: z.string(),
  currency: z.string().optional(),
  company: z.string(),
  transaction_date: z.string().default('Today'),
  customer_warehouse: z.string(),
  amended_from: z.string().optional(),
  set_delivery_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  received_items: z.array(z.unknown()).optional(),
  scrap_items: z.array(z.unknown()).optional(),
  service_items: z.array(z.unknown()),
  status: z.enum(['Draft', 'Open', 'Ongoing', 'Produced', 'Delivered', 'Returned', 'Cancelled', 'Closed']).default('Draft'),
  per_raw_material_received: z.number().optional(),
  per_produced: z.number().optional(),
  per_delivered: z.number().optional(),
  per_raw_material_returned: z.number().optional(),
  per_process_loss: z.number().optional(),
  per_returned: z.number().optional(),
});

export type SubcontractingInwardOrder = z.infer<typeof SubcontractingInwardOrderSchema>;

export const SubcontractingInwardOrderInsertSchema = SubcontractingInwardOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingInwardOrderInsert = z.infer<typeof SubcontractingInwardOrderInsertSchema>;
