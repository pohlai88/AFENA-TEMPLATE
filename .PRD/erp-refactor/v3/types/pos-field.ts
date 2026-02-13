import { z } from 'zod';

export const PosFieldSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  fieldname: z.string().optional(),
  label: z.string().optional(),
  fieldtype: z.string().optional(),
  options: z.string().optional(),
  default_value: z.string().optional(),
  reqd: z.boolean().optional().default(false),
  read_only: z.boolean().optional().default(false),
});

export type PosField = z.infer<typeof PosFieldSchema>;

export const PosFieldInsertSchema = PosFieldSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosFieldInsert = z.infer<typeof PosFieldInsertSchema>;
