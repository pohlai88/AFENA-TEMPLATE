import { z } from 'zod';

export const MasterProductionScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['MPS.YY.-.######']).default('MPS.YY.-.######'),
  company: z.string(),
  posting_date: z.string().default('Today'),
  from_date: z.string(),
  to_date: z.string().optional(),
  select_items: z.array(z.unknown()).optional(),
  parent_warehouse: z.string().optional(),
  sales_orders: z.array(z.unknown()).optional(),
  material_requests: z.array(z.unknown()).optional(),
  items: z.array(z.unknown()).optional(),
  sales_forecast: z.string().optional(),
  amended_from: z.string().optional(),
});

export type MasterProductionSchedule = z.infer<typeof MasterProductionScheduleSchema>;

export const MasterProductionScheduleInsertSchema = MasterProductionScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MasterProductionScheduleInsert = z.infer<typeof MasterProductionScheduleInsertSchema>;
