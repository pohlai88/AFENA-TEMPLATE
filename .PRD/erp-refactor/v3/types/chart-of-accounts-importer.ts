import { z } from 'zod';

export const ChartOfAccountsImporterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  import_file: z.string().optional(),
  chart_tree: z.string().optional(),
});

export type ChartOfAccountsImporter = z.infer<typeof ChartOfAccountsImporterSchema>;

export const ChartOfAccountsImporterInsertSchema = ChartOfAccountsImporterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ChartOfAccountsImporterInsert = z.infer<typeof ChartOfAccountsImporterInsertSchema>;
