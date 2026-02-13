import { z } from 'zod';

export const TaxWithholdingGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  group_name: z.string(),
});

export type TaxWithholdingGroup = z.infer<typeof TaxWithholdingGroupSchema>;

export const TaxWithholdingGroupInsertSchema = TaxWithholdingGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxWithholdingGroupInsert = z.infer<typeof TaxWithholdingGroupInsertSchema>;
