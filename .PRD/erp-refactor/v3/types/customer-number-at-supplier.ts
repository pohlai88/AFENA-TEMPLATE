import { z } from 'zod';

export const CustomerNumberAtSupplierSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  customer_number: z.string().optional(),
});

export type CustomerNumberAtSupplier = z.infer<typeof CustomerNumberAtSupplierSchema>;

export const CustomerNumberAtSupplierInsertSchema = CustomerNumberAtSupplierSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerNumberAtSupplierInsert = z.infer<typeof CustomerNumberAtSupplierInsertSchema>;
