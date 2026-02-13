import { describe, it, expect } from 'vitest';
import { MaintenanceScheduleItemSchema, MaintenanceScheduleItemInsertSchema } from '../types/maintenance-schedule-item.js';

describe('MaintenanceScheduleItem Zod validation', () => {
  const validSample = {
      "id": "TEST-MaintenanceScheduleItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "periodicity": "Weekly",
      "no_of_visits": 1,
      "sales_person": "LINK-sales_person-001",
      "serial_no": "Sample text for serial_no",
      "sales_order": "LINK-sales_order-001",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001"
  };

  it('validates a correct Maintenance Schedule Item object', () => {
    const result = MaintenanceScheduleItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MaintenanceScheduleItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = MaintenanceScheduleItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MaintenanceScheduleItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
