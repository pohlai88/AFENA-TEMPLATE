import { z } from 'zod';

export const TimesheetSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional().default('{employee_name}'),
  naming_series: z.enum(['TS-.YYYY.-']),
  company: z.string().optional(),
  customer: z.string().optional(),
  currency: z.string().optional(),
  exchange_rate: z.number().optional().default(1),
  sales_invoice: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Partially Billed', 'Billed', 'Payslip', 'Completed', 'Cancelled']).optional().default('Draft'),
  parent_project: z.string().optional(),
  employee: z.string().optional(),
  employee_name: z.string().optional(),
  department: z.string().optional(),
  user: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  time_logs: z.array(z.unknown()),
  total_hours: z.number().optional().default(0),
  total_billable_hours: z.number().optional(),
  base_total_billable_amount: z.number().optional(),
  base_total_billed_amount: z.number().optional(),
  base_total_costing_amount: z.number().optional(),
  total_billed_hours: z.number().optional(),
  total_billable_amount: z.number().optional().default(0),
  total_billed_amount: z.number().optional(),
  total_costing_amount: z.number().optional(),
  per_billed: z.number().optional(),
  note: z.string().optional(),
  amended_from: z.string().optional(),
});

export type Timesheet = z.infer<typeof TimesheetSchema>;

export const TimesheetInsertSchema = TimesheetSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TimesheetInsert = z.infer<typeof TimesheetInsertSchema>;
