import { z } from 'zod';

export const ManufacturingSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  material_consumption: z.boolean().optional().default(false),
  get_rm_cost_from_consumption_entry: z.boolean().optional().default(false),
  backflush_raw_materials_based_on: z.enum(['BOM', 'Material Transferred for Manufacture']).optional().default('BOM'),
  validate_components_quantities_per_bom: z.boolean().optional().default(false),
  update_bom_costs_automatically: z.boolean().optional().default(false),
  allow_editing_of_items_and_quantities_in_work_order: z.boolean().optional().default(false),
  overproduction_percentage_for_sales_order: z.number().optional(),
  overproduction_percentage_for_work_order: z.number().optional(),
  transfer_extra_materials_percentage: z.number().optional(),
  add_corrective_operation_cost_in_finished_good_valuation: z.boolean().optional().default(false),
  enforce_time_logs: z.boolean().optional().default(false),
  job_card_excess_transfer: z.boolean().optional().default(false),
  disable_capacity_planning: z.boolean().optional().default(false),
  allow_overtime: z.boolean().optional().default(false),
  allow_production_on_holidays: z.boolean().optional().default(false),
  capacity_planning_for_days: z.number().int().optional().default(30),
  mins_between_operations: z.number().int().optional(),
  set_op_cost_and_scrap_from_sub_assemblies: z.boolean().optional().default(false),
  make_serial_no_batch_from_work_order: z.boolean().optional().default(false),
});

export type ManufacturingSettings = z.infer<typeof ManufacturingSettingsSchema>;

export const ManufacturingSettingsInsertSchema = ManufacturingSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ManufacturingSettingsInsert = z.infer<typeof ManufacturingSettingsInsertSchema>;
