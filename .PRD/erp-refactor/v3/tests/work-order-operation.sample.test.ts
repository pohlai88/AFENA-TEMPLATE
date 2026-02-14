import { describe, it, expect } from 'vitest';
import { WorkOrderOperationSchema, WorkOrderOperationInsertSchema } from '../types/work-order-operation.js';

describe('WorkOrderOperation Zod validation', () => {
  const validSample = {
      "id": "TEST-WorkOrderOperation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "operation": "LINK-operation-001",
      "status": "Pending",
      "completed_qty": 1,
      "process_loss_qty": 1,
      "bom": "LINK-bom-001",
      "workstation_type": "LINK-workstation_type-001",
      "workstation": "LINK-workstation-001",
      "sequence_id": 1,
      "bom_no": "LINK-bom_no-001",
      "finished_good": "LINK-finished_good-001",
      "is_subcontracted": "0",
      "skip_material_transfer": "0",
      "backflush_from_wip_warehouse": "0",
      "source_warehouse": "LINK-source_warehouse-001",
      "wip_warehouse": "LINK-wip_warehouse-001",
      "fg_warehouse": "LINK-fg_warehouse-001",
      "description": "Sample text for description",
      "planned_start_time": "2024-01-15T10:30:00.000Z",
      "hour_rate": 1,
      "time_in_mins": 1,
      "planned_end_time": "2024-01-15T10:30:00.000Z",
      "batch_size": 1,
      "planned_operating_cost": 100,
      "actual_start_time": "2024-01-15T10:30:00.000Z",
      "actual_operation_time": 1,
      "actual_end_time": "2024-01-15T10:30:00.000Z",
      "actual_operating_cost": 100
  };

  it('validates a correct Work Order Operation object', () => {
    const result = WorkOrderOperationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WorkOrderOperationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "operation" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).operation;
    const result = WorkOrderOperationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WorkOrderOperationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
