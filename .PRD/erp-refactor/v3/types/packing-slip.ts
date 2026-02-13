import { z } from 'zod';

export const PackingSlipSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  delivery_note: z.string(),
  naming_series: z.enum(['MAT-PAC-.YYYY.-']),
  from_case_no: z.number().int(),
  to_case_no: z.number().int().optional(),
  items: z.array(z.unknown()),
  net_weight_pkg: z.number().optional(),
  net_weight_uom: z.string().optional(),
  gross_weight_pkg: z.number().optional(),
  gross_weight_uom: z.string().optional(),
  letter_head: z.string().optional(),
  amended_from: z.string().optional(),
});

export type PackingSlip = z.infer<typeof PackingSlipSchema>;

export const PackingSlipInsertSchema = PackingSlipSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PackingSlipInsert = z.infer<typeof PackingSlipInsertSchema>;
