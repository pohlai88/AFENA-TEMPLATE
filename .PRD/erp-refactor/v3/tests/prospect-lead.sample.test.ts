import { describe, it, expect } from 'vitest';
import { ProspectLeadSchema, ProspectLeadInsertSchema } from '../types/prospect-lead.js';

describe('ProspectLead Zod validation', () => {
  const validSample = {
      "id": "TEST-ProspectLead-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "lead": "LINK-lead-001",
      "lead_name": "Sample Lead Name",
      "email": "test@example.com",
      "mobile_no": "+1-555-0100",
      "lead_owner": "Sample Lead Owner",
      "status": "Sample Status"
  };

  it('validates a correct Prospect Lead object', () => {
    const result = ProspectLeadSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProspectLeadInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "lead" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).lead;
    const result = ProspectLeadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProspectLeadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
