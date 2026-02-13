import { z } from 'zod';

export const ManufacturerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  short_name: z.string(),
  full_name: z.string().optional(),
  website: z.string().optional(),
  country: z.string().optional(),
  logo: z.string().optional(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  notes: z.string().optional(),
});

export type Manufacturer = z.infer<typeof ManufacturerSchema>;

export const ManufacturerInsertSchema = ManufacturerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ManufacturerInsert = z.infer<typeof ManufacturerInsertSchema>;
