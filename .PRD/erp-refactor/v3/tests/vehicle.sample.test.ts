import { describe, it, expect } from 'vitest';
import { VehicleSchema, VehicleInsertSchema } from '../types/vehicle.js';

describe('Vehicle Zod validation', () => {
  const validSample = {
      "id": "TEST-Vehicle-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "license_plate": "Sample License Plate",
      "make": "Sample Make",
      "model": "Sample Model",
      "company": "LINK-company-001",
      "last_odometer": 1,
      "acquisition_date": "2024-01-15",
      "location": "Sample Location",
      "chassis_no": "Sample Chassis No",
      "vehicle_value": 100,
      "employee": "LINK-employee-001",
      "insurance_company": "Sample Insurance Company",
      "policy_no": "Sample Policy No",
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "fuel_type": "Petrol",
      "uom": "LINK-uom-001",
      "carbon_check_date": "2024-01-15",
      "color": "Sample Color",
      "wheels": 1,
      "doors": 1,
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Vehicle object', () => {
    const result = VehicleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = VehicleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "license_plate" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).license_plate;
    const result = VehicleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = VehicleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
