import { z } from 'zod';

export const AccountingPeriodSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  period_name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  company: z.string(),
  disabled: z.boolean().optional().default(false),
  exempted_role: z.string().optional(),
  closed_documents: z.array(z.unknown()),
});

export type AccountingPeriod = z.infer<typeof AccountingPeriodSchema>;

export const AccountingPeriodInsertSchema = AccountingPeriodSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountingPeriodInsert = z.infer<typeof AccountingPeriodInsertSchema>;
