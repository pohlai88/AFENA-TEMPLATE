import { z } from 'zod';

export const PosSearchFieldsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  field: z.string(),
  fieldname: z.string().optional(),
});

export type PosSearchFields = z.infer<typeof PosSearchFieldsSchema>;

export const PosSearchFieldsInsertSchema = PosSearchFieldsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosSearchFieldsInsert = z.infer<typeof PosSearchFieldsInsertSchema>;
