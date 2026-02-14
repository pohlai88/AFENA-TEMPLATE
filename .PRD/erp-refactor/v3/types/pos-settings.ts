import { z } from 'zod';

export const PosSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  invoice_type: z.enum(['Sales Invoice', 'POS Invoice']).optional().default('Sales Invoice'),
  post_change_gl_entries: z.boolean().optional().default(false),
  invoice_fields: z.array(z.unknown()).optional(),
  pos_search_fields: z.array(z.unknown()).optional(),
});

export type PosSettings = z.infer<typeof PosSettingsSchema>;

export const PosSettingsInsertSchema = PosSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosSettingsInsert = z.infer<typeof PosSettingsInsertSchema>;
