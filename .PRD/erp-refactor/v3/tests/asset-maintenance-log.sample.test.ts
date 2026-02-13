import { describe, it, expect } from 'vitest';
import { AssetMaintenanceLogSchema, AssetMaintenanceLogInsertSchema } from '../types/asset-maintenance-log.js';

describe('AssetMaintenanceLog Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetMaintenanceLog-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "asset_maintenance": "LINK-asset_maintenance-001",
      "naming_series": "Option1",
      "asset_name": "Read Only Value",
      "item_code": "Read Only Value",
      "item_name": "Read Only Value",
      "task": "LINK-task-001",
      "task_name": "Sample Task Name",
      "maintenance_type": "Read Only Value",
      "periodicity": "Sample Periodicity",
      "has_certificate": "0",
      "certificate_attachement": "/files/sample.png",
      "maintenance_status": "Planned",
      "assign_to_name": "Read Only Value",
      "task_assignee_email": "Sample Task Assignee Email",
      "due_date": "2024-01-15",
      "completion_date": "2024-01-15",
      "description": "Read Only Value",
      "actions_performed": "Sample text for actions_performed",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Asset Maintenance Log object', () => {
    const result = AssetMaintenanceLogSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetMaintenanceLogInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = AssetMaintenanceLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetMaintenanceLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
