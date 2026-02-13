import { z } from 'zod';

export const BudgetSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['BUDGET-.########']).default('BUDGET-.########'),
  budget_against: z.enum(['Cost Center', 'Project']).default('Cost Center'),
  company: z.string(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  account: z.string(),
  amended_from: z.string().optional(),
  from_fiscal_year: z.string(),
  to_fiscal_year: z.string(),
  budget_start_date: z.string().optional(),
  budget_end_date: z.string().optional(),
  distribution_frequency: z.enum(['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']).default('Monthly'),
  budget_amount: z.number(),
  distribute_equally: z.boolean().optional().default(true),
  budget_distribution: z.array(z.unknown()).optional(),
  budget_distribution_total: z.number().optional(),
  applicable_on_material_request: z.boolean().optional().default(false),
  action_if_annual_budget_exceeded_on_mr: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Stop'),
  action_if_accumulated_monthly_budget_exceeded_on_mr: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Warn'),
  applicable_on_purchase_order: z.boolean().optional().default(false),
  action_if_annual_budget_exceeded_on_po: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Stop'),
  action_if_accumulated_monthly_budget_exceeded_on_po: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Warn'),
  applicable_on_booking_actual_expenses: z.boolean().optional().default(false),
  action_if_annual_budget_exceeded: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Stop'),
  action_if_accumulated_monthly_budget_exceeded: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Warn'),
  applicable_on_cumulative_expense: z.boolean().optional().default(false),
  action_if_annual_exceeded_on_cumulative_expense: z.enum(['Stop', 'Warn', 'Ignore']).optional(),
  action_if_accumulated_monthly_exceeded_on_cumulative_expense: z.enum(['Stop', 'Warn', 'Ignore']).optional(),
  revision_of: z.string().optional(),
});

export type Budget = z.infer<typeof BudgetSchema>;

export const BudgetInsertSchema = BudgetSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BudgetInsert = z.infer<typeof BudgetInsertSchema>;
