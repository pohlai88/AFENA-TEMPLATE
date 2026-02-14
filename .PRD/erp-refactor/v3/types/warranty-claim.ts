import { z } from 'zod';

export const WarrantyClaimSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['SER-WRN-.YYYY.-']),
  status: z.enum(['Open', 'Closed', 'Work In Progress', 'Cancelled']).default('Open'),
  complaint_date: z.string().default('Today'),
  customer: z.string(),
  serial_no: z.string().optional(),
  complaint: z.string(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  warranty_amc_status: z.enum(['Under Warranty', 'Out of Warranty', 'Under AMC', 'Out of AMC']).optional(),
  warranty_expiry_date: z.string().optional(),
  amc_expiry_date: z.string().optional(),
  resolution_date: z.string().optional(),
  resolved_by: z.string().optional(),
  resolution_details: z.string().optional(),
  customer_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  territory: z.string().optional(),
  customer_group: z.string().optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  service_address: z.string().optional(),
  company: z.string(),
  complaint_raised_by: z.string().optional(),
  from_company: z.string().optional(),
  amended_from: z.string().optional(),
});

export type WarrantyClaim = z.infer<typeof WarrantyClaimSchema>;

export const WarrantyClaimInsertSchema = WarrantyClaimSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WarrantyClaimInsert = z.infer<typeof WarrantyClaimInsertSchema>;
