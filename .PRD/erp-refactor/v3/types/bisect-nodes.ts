import { z } from 'zod';

export const BisectNodesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  root: z.string().optional(),
  left_child: z.string().optional(),
  right_child: z.string().optional(),
  period_from_date: z.string().optional(),
  period_to_date: z.string().optional(),
  difference: z.number().optional(),
  balance_sheet_summary: z.number().optional(),
  profit_loss_summary: z.number().optional(),
  generated: z.boolean().optional().default(false),
});

export type BisectNodes = z.infer<typeof BisectNodesSchema>;

export const BisectNodesInsertSchema = BisectNodesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BisectNodesInsert = z.infer<typeof BisectNodesInsertSchema>;
