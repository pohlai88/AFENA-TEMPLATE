import { describe, it, expect } from 'vitest';
import { MaintenanceVisitPurposeSchema, MaintenanceVisitPurposeInsertSchema } from '../types/maintenance-visit-purpose.js';

describe('MaintenanceVisitPurpose Zod validation', () => {
  const validSample = {
      "id": "TEST-MaintenanceVisitPurpose-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "service_person": "LINK-service_person-001",
      "serial_no": "LINK-serial_no-001",
      "description": "Sample text for description",
      "work_done": "Sample text for work_done",
      "prevdoc_doctype": "LINK-prevdoc_doctype-001",
      "prevdoc_docname": "LINK-prevdoc_docname-001",
      "maintenance_schedule_detail": "Sample Maintenance Schedule Detail"
  };

  it('validates a correct Maintenance Visit Purpose object', () => {
    const result = MaintenanceVisitPurposeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MaintenanceVisitPurposeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "service_person" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).service_person;
    const result = MaintenanceVisitPurposeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MaintenanceVisitPurposeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
