import { describe, it, expect } from 'vitest';
import { NonConformanceSchema, NonConformanceInsertSchema } from '../types/non-conformance.js';

describe('NonConformance Zod validation', () => {
  const validSample = {
      "id": "TEST-NonConformance-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "subject": "Sample Subject",
      "procedure": "LINK-procedure-001",
      "process_owner": "Sample Process Owner",
      "full_name": "Sample Full Name",
      "status": "Open",
      "details": "Sample text for details",
      "corrective_action": "Sample text for corrective_action",
      "preventive_action": "Sample text for preventive_action"
  };

  it('validates a correct Non Conformance object', () => {
    const result = NonConformanceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = NonConformanceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "subject" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).subject;
    const result = NonConformanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = NonConformanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
