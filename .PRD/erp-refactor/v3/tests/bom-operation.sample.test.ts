import { describe, it, expect } from 'vitest';
import { BomOperationSchema, BomOperationInsertSchema } from '../types/bom-operation.js';

describe('BomOperation Zod validation', () => {
  const validSample = {
      "id": "TEST-BomOperation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "operation": "LINK-operation-001",
      "sequence_id": 1,
      "finished_good": "LINK-finished_good-001",
      "finished_good_qty": "1",
      "bom_no": "LINK-bom_no-001",
      "workstation_type": "LINK-workstation_type-001",
      "workstation": "LINK-workstation-001",
      "time_in_mins": 1,
      "fixed_time": "0",
      "is_subcontracted": "0",
      "is_final_finished_good": "0",
      "set_cost_based_on_bom_qty": "0",
      "skip_material_transfer": "0",
      "backflush_from_wip_warehouse": "0",
      "source_warehouse": "LINK-source_warehouse-001",
      "wip_warehouse": "LINK-wip_warehouse-001",
      "fg_warehouse": "LINK-fg_warehouse-001",
      "hour_rate": 100,
      "base_hour_rate": 100,
      "batch_size": 1,
      "cost_per_unit": 1,
      "base_cost_per_unit": 1,
      "operating_cost": 100,
      "base_operating_cost": 100,
      "description": "Sample text for description",
      "image": "/files/sample.png"
  };

  it('validates a correct BOM Operation object', () => {
    const result = BomOperationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomOperationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "operation" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).operation;
    const result = BomOperationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomOperationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
