import { z } from 'zod';

export const RequestForQuotationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['PUR-RFQ-.YYYY.-']),
  company: z.string(),
  billing_address: z.string().optional(),
  billing_address_display: z.string().optional(),
  vendor: z.string().optional(),
  transaction_date: z.string().default('Today'),
  schedule_date: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Cancelled']),
  has_unit_price_items: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
  suppliers: z.array(z.unknown()),
  items: z.array(z.unknown()),
  email_template: z.string().optional(),
  html_llwp: z.string().optional(),
  send_attached_files: z.boolean().optional().default(true),
  send_document_print: z.boolean().optional().default(false),
  subject: z.string().default('Request for Quotation'),
  message_for_supplier: z.string().default('Please supply the specified items at the best possible rates'),
  incoterm: z.string().optional(),
  named_place: z.string().optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  select_print_heading: z.string().optional(),
  letter_head: z.string().optional(),
  opportunity: z.string().optional(),
});

export type RequestForQuotation = z.infer<typeof RequestForQuotationSchema>;

export const RequestForQuotationInsertSchema = RequestForQuotationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RequestForQuotationInsert = z.infer<typeof RequestForQuotationInsertSchema>;
