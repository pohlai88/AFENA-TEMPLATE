import { z } from 'zod';

export const MaintenanceVisitPurposeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  service_person: z.string(),
  serial_no: z.string().optional(),
  description: z.string().optional(),
  work_done: z.string(),
  prevdoc_doctype: z.string().optional(),
  prevdoc_docname: z.string().optional(),
  maintenance_schedule_detail: z.string().optional(),
});

export type MaintenanceVisitPurpose = z.infer<typeof MaintenanceVisitPurposeSchema>;

export const MaintenanceVisitPurposeInsertSchema = MaintenanceVisitPurposeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceVisitPurposeInsert = z.infer<typeof MaintenanceVisitPurposeInsertSchema>;
