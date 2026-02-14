import { z } from 'zod';

export const BomWebsiteOperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operation: z.string(),
  workstation: z.string().optional(),
  time_in_mins: z.number(),
  website_image: z.string().optional(),
  thumbnail: z.string().optional(),
});

export type BomWebsiteOperation = z.infer<typeof BomWebsiteOperationSchema>;

export const BomWebsiteOperationInsertSchema = BomWebsiteOperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomWebsiteOperationInsert = z.infer<typeof BomWebsiteOperationInsertSchema>;
