import { z } from 'zod';

export const SalesTeamSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_person: z.string(),
  contact_no: z.string().optional(),
  allocated_percentage: z.number().optional(),
  allocated_amount: z.number().optional(),
  commission_rate: z.string().optional(),
  incentives: z.number().optional(),
});

export type SalesTeam = z.infer<typeof SalesTeamSchema>;

export const SalesTeamInsertSchema = SalesTeamSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesTeamInsert = z.infer<typeof SalesTeamInsertSchema>;
