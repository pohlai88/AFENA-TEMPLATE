import { z } from 'zod';

export const GlobalDefaultsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  default_company: z.string().optional(),
  country: z.string().optional(),
  default_distance_unit: z.string().optional(),
  default_currency: z.string().default('INR'),
  hide_currency_symbol: z.enum(['No', 'Yes']).optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  disable_in_words: z.boolean().optional().default(false),
  use_posting_datetime_for_naming_documents: z.boolean().optional().default(false),
  demo_company: z.string().optional(),
});

export type GlobalDefaults = z.infer<typeof GlobalDefaultsSchema>;

export const GlobalDefaultsInsertSchema = GlobalDefaultsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type GlobalDefaultsInsert = z.infer<typeof GlobalDefaultsInsertSchema>;
