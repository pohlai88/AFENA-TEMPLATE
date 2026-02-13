import { z } from 'zod';

export const DunningTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  dunning_type: z.string(),
  is_default: z.boolean().optional().default(false),
  company: z.string(),
  dunning_fee: z.number().optional(),
  rate_of_interest: z.number().optional(),
  dunning_letter_text: z.array(z.unknown()).optional(),
  income_account: z.string().optional(),
  cost_center: z.string().optional(),
});

export type DunningType = z.infer<typeof DunningTypeSchema>;

export const DunningTypeInsertSchema = DunningTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DunningTypeInsert = z.infer<typeof DunningTypeInsertSchema>;
