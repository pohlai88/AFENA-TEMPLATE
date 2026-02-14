import { describe, it, expect } from 'vitest';
import { DriverSchema, DriverInsertSchema } from '../types/driver.js';

describe('Driver Zod validation', () => {
  const validSample = {
      "id": "TEST-Driver-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "Option1",
      "full_name": "Sample Full Name",
      "status": "Active",
      "transporter": "LINK-transporter-001",
      "employee": "LINK-employee-001",
      "cell_number": "Sample Cellphone Number",
      "address": "LINK-address-001",
      "user": "LINK-user-001",
      "license_number": "Sample License Number",
      "issuing_date": "2024-01-15",
      "expiry_date": "2024-01-15"
  };

  it('validates a correct Driver object', () => {
    const result = DriverSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DriverInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "full_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).full_name;
    const result = DriverSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DriverSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
