import { z } from 'zod';

export const BisectAccountingStatementsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  algorithm: z.enum(['BFS', 'DFS']).optional().default('BFS'),
  current_node: z.string().optional(),
  bisect_heatmap: z.string().optional(),
  current_from_date: z.string().optional(),
  current_to_date: z.string().optional(),
  p_l_summary: z.number().optional(),
  b_s_summary: z.number().optional(),
  difference: z.number().optional(),
});

export type BisectAccountingStatements = z.infer<typeof BisectAccountingStatementsSchema>;

export const BisectAccountingStatementsInsertSchema = BisectAccountingStatementsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BisectAccountingStatementsInsert = z.infer<typeof BisectAccountingStatementsInsertSchema>;
