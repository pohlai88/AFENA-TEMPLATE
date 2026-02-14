import { z } from 'zod';

export const UomSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  uom_name: z.string(),
  symbol: z.string().optional(),
  common_code: z.string().max(3).optional(),
  description: z.string().optional(),
  enabled: z.boolean().optional().default(true),
  must_be_whole_number: z.boolean().optional().default(false),
});

export type Uom = z.infer<typeof UomSchema>;

export const UomInsertSchema = UomSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UomInsert = z.infer<typeof UomInsertSchema>;
