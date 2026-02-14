import { z } from 'zod';

export const CompetitorDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  competitor: z.string(),
});

export type CompetitorDetail = z.infer<typeof CompetitorDetailSchema>;

export const CompetitorDetailInsertSchema = CompetitorDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CompetitorDetailInsert = z.infer<typeof CompetitorDetailInsertSchema>;
