import { z } from 'zod';

export const SalesForecastSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['SF.YY.-.######']).default('SF.YY.-.######'),
  company: z.string(),
  posting_date: z.string().optional().default('Today'),
  from_date: z.string().default('Today'),
  frequency: z.enum(['Weekly', 'Monthly']).default('Monthly'),
  demand_number: z.number().int().default(6),
  selected_items: z.array(z.unknown()),
  parent_warehouse: z.string(),
  items: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
  status: z.enum(['Planned', 'MPS Generated', 'Cancelled']).optional(),
});

export type SalesForecast = z.infer<typeof SalesForecastSchema>;

export const SalesForecastInsertSchema = SalesForecastSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesForecastInsert = z.infer<typeof SalesForecastInsertSchema>;
