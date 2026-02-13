import { z } from 'zod';

export const SupplierNumberAtCustomerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  supplier_number: z.string().optional(),
});

export type SupplierNumberAtCustomer = z.infer<typeof SupplierNumberAtCustomerSchema>;

export const SupplierNumberAtCustomerInsertSchema = SupplierNumberAtCustomerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierNumberAtCustomerInsert = z.infer<typeof SupplierNumberAtCustomerInsertSchema>;
