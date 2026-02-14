import { z } from 'zod';

export const MaterialRequestSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-MR-.YYYY.-']),
  title: z.string().optional().default('{material_request_type}'),
  material_request_type: z.enum(['Purchase', 'Material Transfer', 'Material Issue', 'Manufacture', 'Subcontracting', 'Customer Provided']),
  customer: z.string().optional(),
  company: z.string(),
  auto_created_via_reorder: z.boolean().optional().default(false),
  transaction_date: z.string().default('Today'),
  schedule_date: z.string().optional(),
  buying_price_list: z.string().optional(),
  amended_from: z.string().optional(),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  set_from_warehouse: z.string().optional(),
  set_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Stopped', 'Cancelled', 'Pending', 'Partially Ordered', 'Partially Received', 'Ordered', 'Issued', 'Transferred', 'Received']).optional(),
  per_ordered: z.number().optional(),
  transfer_status: z.enum(['Not Started', 'In Transit', 'Completed']).optional(),
  per_received: z.number().optional(),
  letter_head: z.string().optional(),
  select_print_heading: z.string().optional(),
  job_card: z.string().optional(),
  work_order: z.string().optional(),
});

export type MaterialRequest = z.infer<typeof MaterialRequestSchema>;

export const MaterialRequestInsertSchema = MaterialRequestSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaterialRequestInsert = z.infer<typeof MaterialRequestInsertSchema>;
