import { z } from 'zod';

export const RequestForQuotationItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  supplier_part_no: z.string().optional(),
  item_name: z.string().optional(),
  schedule_date: z.string().default('Today'),
  description: z.string().optional(),
  item_group: z.string().optional(),
  brand: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number(),
  stock_uom: z.string(),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_qty: z.number().optional(),
  warehouse: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
  project_name: z.string().optional(),
  page_break: z.boolean().optional().default(false),
});

export type RequestForQuotationItem = z.infer<typeof RequestForQuotationItemSchema>;

export const RequestForQuotationItemInsertSchema = RequestForQuotationItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RequestForQuotationItemInsert = z.infer<typeof RequestForQuotationItemInsertSchema>;
