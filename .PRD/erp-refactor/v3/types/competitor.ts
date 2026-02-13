import { z } from 'zod';

export const CompetitorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  competitor_name: z.string(),
  website: z.string().optional(),
});

export type Competitor = z.infer<typeof CompetitorSchema>;

export const CompetitorInsertSchema = CompetitorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CompetitorInsert = z.infer<typeof CompetitorInsertSchema>;
