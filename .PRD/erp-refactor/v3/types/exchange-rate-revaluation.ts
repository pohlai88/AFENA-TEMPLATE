import { z } from 'zod';

export const ExchangeRateRevaluationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  posting_date: z.string().default('Today'),
  rounding_loss_allowance: z.number().optional().default(0.05),
  company: z.string(),
  accounts: z.array(z.unknown()),
  gain_loss_unbooked: z.number().optional(),
  gain_loss_booked: z.number().optional(),
  total_gain_loss: z.number().optional(),
  amended_from: z.string().optional(),
});

export type ExchangeRateRevaluation = z.infer<typeof ExchangeRateRevaluationSchema>;

export const ExchangeRateRevaluationInsertSchema = ExchangeRateRevaluationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ExchangeRateRevaluationInsert = z.infer<typeof ExchangeRateRevaluationInsertSchema>;
