import { z } from 'zod';

export const DunningLetterTextSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  language: z.string().optional(),
  is_default_language: z.boolean().optional().default(false),
  body_text: z.string().optional(),
  closing_text: z.string().optional(),
  body_and_closing_text_help: z.string().optional(),
});

export type DunningLetterText = z.infer<typeof DunningLetterTextSchema>;

export const DunningLetterTextInsertSchema = DunningLetterTextSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DunningLetterTextInsert = z.infer<typeof DunningLetterTextInsertSchema>;
