import { z } from 'zod';

export const TimesheetDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  activity_type: z.string().optional(),
  from_time: z.string().optional(),
  description: z.string().optional(),
  expected_hours: z.number().optional(),
  to_time: z.string().optional(),
  hours: z.number().optional(),
  completed: z.boolean().optional().default(false),
  project: z.string().optional(),
  project_name: z.string().optional(),
  task: z.string().optional(),
  is_billable: z.boolean().optional().default(false),
  sales_invoice: z.string().optional(),
  billing_hours: z.number().optional(),
  base_billing_rate: z.number().optional(),
  base_billing_amount: z.number().optional(),
  base_costing_rate: z.number().optional(),
  base_costing_amount: z.number().optional(),
  billing_rate: z.number().optional(),
  billing_amount: z.number().optional().default(0),
  costing_rate: z.number().optional(),
  costing_amount: z.number().optional().default(0),
});

export type TimesheetDetail = z.infer<typeof TimesheetDetailSchema>;

export const TimesheetDetailInsertSchema = TimesheetDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TimesheetDetailInsert = z.infer<typeof TimesheetDetailInsertSchema>;
