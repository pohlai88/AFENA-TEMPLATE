import { describe, it, expect } from 'vitest';
import { ManufacturingSettingsSchema, ManufacturingSettingsInsertSchema } from '../types/manufacturing-settings.js';

describe('ManufacturingSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-ManufacturingSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "material_consumption": "0",
      "get_rm_cost_from_consumption_entry": "0",
      "backflush_raw_materials_based_on": "BOM",
      "validate_components_quantities_per_bom": "0",
      "update_bom_costs_automatically": "0",
      "allow_editing_of_items_and_quantities_in_work_order": "0",
      "overproduction_percentage_for_sales_order": 1,
      "overproduction_percentage_for_work_order": 1,
      "transfer_extra_materials_percentage": 1,
      "add_corrective_operation_cost_in_finished_good_valuation": "0",
      "enforce_time_logs": "0",
      "job_card_excess_transfer": "0",
      "disable_capacity_planning": "0",
      "allow_overtime": "0",
      "allow_production_on_holidays": "0",
      "capacity_planning_for_days": "30",
      "mins_between_operations": 1,
      "set_op_cost_and_scrap_from_sub_assemblies": "0",
      "make_serial_no_batch_from_work_order": "0"
  };

  it('validates a correct Manufacturing Settings object', () => {
    const result = ManufacturingSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ManufacturingSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ManufacturingSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
