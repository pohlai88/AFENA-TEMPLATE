import { describe, it, expect } from 'vitest';
import { AssetMaintenanceTaskSchema, AssetMaintenanceTaskInsertSchema } from '../types/asset-maintenance-task.js';

describe('AssetMaintenanceTask Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetMaintenanceTask-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "maintenance_task": "Sample Maintenance Task",
      "maintenance_type": "Preventive Maintenance",
      "maintenance_status": "Planned",
      "start_date": "Today",
      "periodicity": "Daily",
      "end_date": "2024-01-15",
      "certificate_required": "0",
      "assign_to": "LINK-assign_to-001",
      "assign_to_name": "Read Only Value",
      "next_due_date": "2024-01-15",
      "last_completion_date": "2024-01-15",
      "description": "Sample text for description"
  };

  it('validates a correct Asset Maintenance Task object', () => {
    const result = AssetMaintenanceTaskSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetMaintenanceTaskInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "maintenance_task" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).maintenance_task;
    const result = AssetMaintenanceTaskSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetMaintenanceTaskSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
