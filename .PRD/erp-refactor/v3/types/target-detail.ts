import { z } from 'zod';

export const TargetDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_group: z.string().optional(),
  fiscal_year: z.string(),
  target_qty: z.number().optional(),
  target_amount: z.number().optional(),
  distribution_id: z.string(),
});

export type TargetDetail = z.infer<typeof TargetDetailSchema>;

export const TargetDetailInsertSchema = TargetDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TargetDetailInsert = z.infer<typeof TargetDetailInsertSchema>;
