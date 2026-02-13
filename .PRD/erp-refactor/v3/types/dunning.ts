import { z } from 'zod';

export const DunningSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['DUNN-.MM.-.YY.-']).optional().default('DUNN-.MM.-.YY.-'),
  customer: z.string(),
  customer_name: z.string().optional(),
  company: z.string(),
  posting_date: z.string().default('Today'),
  posting_time: z.string().optional(),
  status: z.enum(['Draft', 'Resolved', 'Unresolved', 'Cancelled']).optional().default('Unresolved'),
  currency: z.string().optional(),
  conversion_rate: z.number().optional(),
  dunning_type: z.string().optional(),
  rate_of_interest: z.number().optional().default(0),
  overdue_payments: z.array(z.unknown()).optional(),
  total_interest: z.number().optional().default(0),
  dunning_fee: z.number().optional().default(0),
  dunning_amount: z.number().optional().default(0),
  base_dunning_amount: z.number().optional().default(0),
  spacer: z.string().optional(),
  total_outstanding: z.number().optional(),
  grand_total: z.number().optional().default(0),
  language: z.string().optional(),
  body_text: z.string().optional(),
  letter_head: z.string().optional(),
  closing_text: z.string().optional(),
  income_account: z.string().optional(),
  cost_center: z.string().optional(),
  amended_from: z.string().optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  company_address: z.string().optional(),
  company_address_display: z.string().optional(),
});

export type Dunning = z.infer<typeof DunningSchema>;

export const DunningInsertSchema = DunningSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DunningInsert = z.infer<typeof DunningInsertSchema>;
