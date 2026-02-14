import { describe, it, expect } from 'vitest';
import { InstallationNoteSchema, InstallationNoteInsertSchema } from '../types/installation-note.js';

describe('InstallationNote Zod validation', () => {
  const validSample = {
      "id": "TEST-InstallationNote-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "customer": "LINK-customer-001",
      "customer_address": "LINK-customer_address-001",
      "contact_person": "LINK-contact_person-001",
      "customer_name": "Sample Name",
      "address_display": "Sample text for address_display",
      "contact_display": "Sample text for contact_display",
      "contact_mobile": "Sample text for contact_mobile",
      "contact_email": "test@example.com",
      "territory": "LINK-territory-001",
      "customer_group": "LINK-customer_group-001",
      "inst_date": "2024-01-15",
      "inst_time": "10:30:00",
      "status": "Draft",
      "company": "LINK-company-001",
      "project": "LINK-project-001",
      "amended_from": "LINK-amended_from-001",
      "remarks": "Sample text for remarks"
  };

  it('validates a correct Installation Note object', () => {
    const result = InstallationNoteSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = InstallationNoteInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = InstallationNoteSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = InstallationNoteSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
