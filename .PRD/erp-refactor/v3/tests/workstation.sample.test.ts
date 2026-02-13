import { describe, it, expect } from 'vitest';
import { WorkstationSchema, WorkstationInsertSchema } from '../types/workstation.js';

describe('Workstation Zod validation', () => {
  const validSample = {
      "id": "TEST-Workstation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "workstation_dashboard": "Sample text for workstation_dashboard",
      "workstation_name": "Sample Workstation Name",
      "workstation_type": "LINK-workstation_type-001",
      "plant_floor": "LINK-plant_floor-001",
      "disabled": "0",
      "production_capacity": "1",
      "warehouse": "LINK-warehouse-001",
      "status": "Production",
      "on_status_image": "/files/sample.png",
      "off_status_image": "/files/sample.png",
      "hour_rate": 100,
      "description": "Sample text for description",
      "holiday_list": "LINK-holiday_list-001",
      "total_working_hours": 1
  };

  it('validates a correct Workstation object', () => {
    const result = WorkstationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WorkstationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "workstation_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).workstation_name;
    const result = WorkstationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WorkstationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
