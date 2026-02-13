import { z } from 'zod';

export const SubOperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operation: z.string().optional(),
  time_in_mins: z.number().optional().default(0),
  description: z.string().optional(),
});

export type SubOperation = z.infer<typeof SubOperationSchema>;

export const SubOperationInsertSchema = SubOperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubOperationInsert = z.infer<typeof SubOperationInsertSchema>;
