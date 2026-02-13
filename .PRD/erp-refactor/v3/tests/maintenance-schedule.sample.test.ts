import { describe, it, expect } from 'vitest';
import { MaintenanceScheduleSchema, MaintenanceScheduleInsertSchema } from '../types/maintenance-schedule.js';

describe('MaintenanceSchedule Zod validation', () => {
  const validSample = {
      "id": "TEST-MaintenanceSchedule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "customer": "LINK-customer-001",
      "status": "Draft",
      "transaction_date": "2024-01-15",
      "customer_name": "Sample Customer Name",
      "contact_person": "LINK-contact_person-001",
      "contact_mobile": "+1-555-0100",
      "contact_email": "test@example.com",
      "contact_display": "Sample text for contact_display",
      "customer_address": "LINK-customer_address-001",
      "address_display": "Sample text for address_display",
      "territory": "LINK-territory-001",
      "customer_group": "LINK-customer_group-001",
      "company": "LINK-company-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Maintenance Schedule object', () => {
    const result = MaintenanceScheduleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MaintenanceScheduleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = MaintenanceScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MaintenanceScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
