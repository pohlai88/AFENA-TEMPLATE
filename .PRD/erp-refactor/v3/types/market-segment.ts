import { z } from 'zod';

export const MarketSegmentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  market_segment: z.string().optional(),
});

export type MarketSegment = z.infer<typeof MarketSegmentSchema>;

export const MarketSegmentInsertSchema = MarketSegmentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MarketSegmentInsert = z.infer<typeof MarketSegmentInsertSchema>;
