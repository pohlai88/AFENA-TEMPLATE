import { z } from 'zod';

export const QualityInspectionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-QA-.YYYY.-']),
  company: z.string().optional(),
  report_date: z.string().default('Today'),
  status: z.enum(['Accepted', 'Rejected', 'Cancelled']).default('Accepted'),
  child_row_reference: z.string().optional(),
  inspection_type: z.enum(['Incoming', 'Outgoing', 'In Process']),
  reference_type: z.enum(['Purchase Receipt', 'Purchase Invoice', 'Subcontracting Receipt', 'Delivery Note', 'Sales Invoice', 'Stock Entry', 'Job Card']),
  reference_name: z.string(),
  item_code: z.string(),
  item_serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  sample_size: z.number(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  bom_no: z.string().optional(),
  quality_inspection_template: z.string().optional(),
  manual_inspection: z.boolean().optional().default(false),
  readings: z.array(z.unknown()).optional(),
  inspected_by: z.string().default('user'),
  verified_by: z.string().optional(),
  remarks: z.string().optional(),
  amended_from: z.string().optional(),
  letter_head: z.string().optional(),
});

export type QualityInspection = z.infer<typeof QualityInspectionSchema>;

export const QualityInspectionInsertSchema = QualityInspectionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityInspectionInsert = z.infer<typeof QualityInspectionInsertSchema>;
