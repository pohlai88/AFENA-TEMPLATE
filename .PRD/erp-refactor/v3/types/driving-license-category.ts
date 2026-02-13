import { z } from 'zod';

export const DrivingLicenseCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  class: z.string().optional(),
  description: z.string().optional(),
  issuing_date: z.string().optional(),
  expiry_date: z.string().optional(),
});

export type DrivingLicenseCategory = z.infer<typeof DrivingLicenseCategorySchema>;

export const DrivingLicenseCategoryInsertSchema = DrivingLicenseCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DrivingLicenseCategoryInsert = z.infer<typeof DrivingLicenseCategoryInsertSchema>;
