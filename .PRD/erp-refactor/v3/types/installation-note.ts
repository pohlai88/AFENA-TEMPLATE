import { z } from 'zod';

export const InstallationNoteSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-INS-.YYYY.-']),
  customer: z.string(),
  customer_address: z.string().optional(),
  contact_person: z.string().optional(),
  customer_name: z.string().optional(),
  address_display: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  territory: z.string(),
  customer_group: z.string().optional(),
  inst_date: z.string(),
  inst_time: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Cancelled']).default('Draft'),
  company: z.string(),
  project: z.string().optional(),
  amended_from: z.string().optional(),
  remarks: z.string().optional(),
  items: z.array(z.unknown()),
});

export type InstallationNote = z.infer<typeof InstallationNoteSchema>;

export const InstallationNoteInsertSchema = InstallationNoteSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type InstallationNoteInsert = z.infer<typeof InstallationNoteInsertSchema>;
