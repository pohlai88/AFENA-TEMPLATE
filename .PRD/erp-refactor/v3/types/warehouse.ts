import { z } from 'zod';

export const WarehouseSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  warehouse_name: z.string(),
  company: z.string(),
  is_rejected_warehouse: z.boolean().optional().default(false),
  account: z.string().optional(),
  parent_warehouse: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  customer: z.string().optional(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  email_id: z.string().optional(),
  phone_no: z.string().optional(),
  mobile_no: z.string().optional(),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pin: z.string().optional(),
  warehouse_type: z.string().optional(),
  default_in_transit_warehouse: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;

export const WarehouseInsertSchema = WarehouseSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WarehouseInsert = z.infer<typeof WarehouseInsertSchema>;
