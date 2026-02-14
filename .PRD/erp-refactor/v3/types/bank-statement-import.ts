import { z } from 'zod';

export const BankStatementImportSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  bank_account: z.string(),
  bank: z.string().optional(),
  import_mt940_fromat: z.boolean().optional().default(false),
  custom_delimiters: z.boolean().optional().default(false),
  delimiter_options: z.string().optional().default(',;\t|'),
  google_sheets_url: z.string().optional(),
  html_5: z.string().optional(),
  import_file: z.string().optional(),
  status: z.enum(['Pending', 'Success', 'Partial Success', 'Error']).optional().default('Pending'),
  template_options: z.string().optional(),
  use_csv_sniffer: z.boolean().optional().default(false),
  template_warnings: z.string().optional(),
  import_warnings: z.string().optional(),
  import_preview: z.string().optional(),
  show_failed_logs: z.boolean().optional().default(false),
  import_log_preview: z.string().optional(),
  reference_doctype: z.string().default('Bank Transaction'),
  import_type: z.enum(['Insert New Records', 'Update Existing Records']).default('Insert New Records'),
  submit_after_import: z.boolean().optional().default(true),
  mute_emails: z.boolean().optional().default(true),
});

export type BankStatementImport = z.infer<typeof BankStatementImportSchema>;

export const BankStatementImportInsertSchema = BankStatementImportSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankStatementImportInsert = z.infer<typeof BankStatementImportInsertSchema>;
