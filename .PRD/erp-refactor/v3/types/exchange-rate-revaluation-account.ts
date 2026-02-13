import { z } from 'zod';

export const ExchangeRateRevaluationAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  account_currency: z.string().optional(),
  balance_in_account_currency: z.number().optional(),
  new_balance_in_account_currency: z.number().optional(),
  current_exchange_rate: z.number().optional(),
  new_exchange_rate: z.number(),
  balance_in_base_currency: z.number().optional(),
  new_balance_in_base_currency: z.number().optional(),
  gain_loss: z.number().optional(),
  zero_balance: z.boolean().optional().default(false),
});

export type ExchangeRateRevaluationAccount = z.infer<typeof ExchangeRateRevaluationAccountSchema>;

export const ExchangeRateRevaluationAccountInsertSchema = ExchangeRateRevaluationAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ExchangeRateRevaluationAccountInsert = z.infer<typeof ExchangeRateRevaluationAccountInsertSchema>;
