import { z } from 'zod';

export const SalesInvoiceTimesheetSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  activity_type: z.string().optional(),
  description: z.string().optional(),
  from_time: z.string().optional(),
  to_time: z.string().optional(),
  billing_hours: z.number().optional(),
  billing_amount: z.number().optional(),
  time_sheet: z.string().optional(),
  timesheet_detail: z.string().optional(),
  project_name: z.string().optional(),
});

export type SalesInvoiceTimesheet = z.infer<typeof SalesInvoiceTimesheetSchema>;

export const SalesInvoiceTimesheetInsertSchema = SalesInvoiceTimesheetSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesInvoiceTimesheetInsert = z.infer<typeof SalesInvoiceTimesheetInsertSchema>;
