import { z } from 'zod';

export const ChequePrintTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  settings: z.string().optional(),
  has_print_format: z.boolean().optional().default(false),
  bank_name: z.string(),
  cheque_size: z.enum(['Regular', 'A4']).optional().default('Regular'),
  starting_position_from_top_edge: z.number().optional(),
  cheque_width: z.number().optional().default(20),
  cheque_height: z.number().optional().default(9),
  scanned_cheque: z.string().optional(),
  is_account_payable: z.boolean().optional().default(true),
  acc_pay_dist_from_top_edge: z.number().optional().default(1),
  acc_pay_dist_from_left_edge: z.number().optional().default(9),
  message_to_show: z.string().optional().default('Acc. Payee'),
  date_settings: z.string().optional(),
  date_dist_from_top_edge: z.number().optional().default(1),
  date_dist_from_left_edge: z.number().optional().default(15),
  payer_name_from_top_edge: z.number().optional().default(2),
  payer_name_from_left_edge: z.number().optional().default(3),
  html_19: z.string().optional(),
  amt_in_words_from_top_edge: z.number().optional().default(3),
  amt_in_words_from_left_edge: z.number().optional().default(4),
  amt_in_word_width: z.number().optional().default(15),
  amt_in_words_line_spacing: z.number().optional().default(0.5),
  amt_in_figures_from_top_edge: z.number().optional().default(3.5),
  amt_in_figures_from_left_edge: z.number().optional().default(16),
  account_no_settings: z.string().optional(),
  acc_no_dist_from_top_edge: z.number().optional().default(5),
  acc_no_dist_from_left_edge: z.number().optional().default(4),
  signatory_from_top_edge: z.number().optional().default(6),
  signatory_from_left_edge: z.number().optional().default(15),
  cheque_print_preview: z.string().optional(),
});

export type ChequePrintTemplate = z.infer<typeof ChequePrintTemplateSchema>;

export const ChequePrintTemplateInsertSchema = ChequePrintTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ChequePrintTemplateInsert = z.infer<typeof ChequePrintTemplateInsertSchema>;
