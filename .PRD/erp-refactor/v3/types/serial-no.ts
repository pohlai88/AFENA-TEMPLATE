import { z } from 'zod';

export const SerialNoSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  serial_no: z.string(),
  item_code: z.string(),
  batch_no: z.string().optional(),
  warehouse: z.string().optional(),
  purchase_rate: z.number().optional(),
  customer: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Consumed', 'Delivered', 'Expired']).optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  item_group: z.string().optional(),
  brand: z.string().optional(),
  asset: z.string().optional(),
  asset_status: z.enum(['Issue', 'Receipt', 'Transfer']).optional(),
  location: z.string().optional(),
  employee: z.string().optional(),
  warranty_expiry_date: z.string().optional(),
  amc_expiry_date: z.string().optional(),
  maintenance_status: z.enum(['Under Warranty', 'Out of Warranty', 'Under AMC', 'Out of AMC']).optional(),
  warranty_period: z.number().int().optional(),
  company: z.string(),
  work_order: z.string().optional(),
  reference_doctype: z.string().optional(),
  posting_date: z.string().optional(),
  reference_name: z.string().optional(),
});

export type SerialNo = z.infer<typeof SerialNoSchema>;

export const SerialNoInsertSchema = SerialNoSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SerialNoInsert = z.infer<typeof SerialNoInsertSchema>;
