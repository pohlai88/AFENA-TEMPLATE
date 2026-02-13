import { z } from 'zod';

export const UnreconcilePaymentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  allocations: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type UnreconcilePayment = z.infer<typeof UnreconcilePaymentSchema>;

export const UnreconcilePaymentInsertSchema = UnreconcilePaymentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UnreconcilePaymentInsert = z.infer<typeof UnreconcilePaymentInsertSchema>;
