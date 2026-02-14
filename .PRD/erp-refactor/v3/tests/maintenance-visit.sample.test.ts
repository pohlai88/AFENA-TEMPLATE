import { describe, it, expect } from 'vitest';
import { MaintenanceVisitSchema, MaintenanceVisitInsertSchema } from '../types/maintenance-visit.js';

describe('MaintenanceVisit Zod validation', () => {
  const validSample = {
      "id": "TEST-MaintenanceVisit-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "customer": "LINK-customer-001",
      "customer_name": "Sample Customer Name",
      "address_display": "Sample text for address_display",
      "contact_display": "Sample text for contact_display",
      "contact_mobile": "+1-555-0100",
      "contact_email": "test@example.com",
      "maintenance_schedule": "LINK-maintenance_schedule-001",
      "maintenance_schedule_detail": "LINK-maintenance_schedule_detail-001",
      "mntc_date": "Today",
      "mntc_time": "10:30:00",
      "completion_status": "Partially Completed",
      "maintenance_type": "Unscheduled",
      "customer_feedback": "Sample text for customer_feedback",
      "status": "Draft",
      "amended_from": "LINK-amended_from-001",
      "company": "LINK-company-001",
      "customer_address": "LINK-customer_address-001",
      "contact_person": "LINK-contact_person-001",
      "territory": "LINK-territory-001",
      "customer_group": "LINK-customer_group-001"
  };

  it('validates a correct Maintenance Visit object', () => {
    const result = MaintenanceVisitSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MaintenanceVisitInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = MaintenanceVisitSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MaintenanceVisitSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
