import { z } from 'zod';

export const DriverSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['HR-DRI-.YYYY.-']).optional(),
  full_name: z.string(),
  status: z.enum(['Active', 'Suspended', 'Left']),
  transporter: z.string().optional(),
  employee: z.string().optional(),
  cell_number: z.string().optional(),
  address: z.string().optional(),
  user: z.string().optional(),
  license_number: z.string().optional(),
  issuing_date: z.string().optional(),
  expiry_date: z.string().optional(),
  driving_license_category: z.array(z.unknown()).optional(),
});

export type Driver = z.infer<typeof DriverSchema>;

export const DriverInsertSchema = DriverSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DriverInsert = z.infer<typeof DriverInsertSchema>;
