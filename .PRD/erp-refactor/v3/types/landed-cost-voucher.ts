import { z } from 'zod';

export const LandedCostVoucherSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-LCV-.YYYY.-']),
  company: z.string(),
  posting_date: z.string().default('Today'),
  purchase_receipts: z.array(z.unknown()),
  items: z.array(z.unknown()),
  vendor_invoices: z.array(z.unknown()).optional(),
  taxes: z.array(z.unknown()),
  total_vendor_invoices_cost: z.number().optional(),
  total_taxes_and_charges: z.number(),
  distribute_charges_based_on: z.enum(['Qty', 'Amount', 'Distribute Manually']),
  amended_from: z.string().optional(),
  landed_cost_help: z.string().optional(),
});

export type LandedCostVoucher = z.infer<typeof LandedCostVoucherSchema>;

export const LandedCostVoucherInsertSchema = LandedCostVoucherSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LandedCostVoucherInsert = z.infer<typeof LandedCostVoucherInsertSchema>;
