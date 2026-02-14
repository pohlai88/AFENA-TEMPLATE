import { describe, it, expect } from 'vitest';
import { MaintenanceScheduleDetailSchema, MaintenanceScheduleDetailInsertSchema } from '../types/maintenance-schedule-detail.js';

describe('MaintenanceScheduleDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-MaintenanceScheduleDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "scheduled_date": "2024-01-15",
      "actual_date": "2024-01-15",
      "sales_person": "LINK-sales_person-001",
      "completion_status": "Pending",
      "serial_no": "Sample text for serial_no",
      "item_reference": "LINK-item_reference-001"
  };

  it('validates a correct Maintenance Schedule Detail object', () => {
    const result = MaintenanceScheduleDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MaintenanceScheduleDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "scheduled_date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).scheduled_date;
    const result = MaintenanceScheduleDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MaintenanceScheduleDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
