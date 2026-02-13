import { describe, it, expect } from 'vitest';
import { CallLogSchema, CallLogInsertSchema } from '../types/call-log.js';

describe('CallLog Zod validation', () => {
  const validSample = {
      "id": "Sample ID",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "from": "Sample From",
      "to": "Sample To",
      "call_received_by": "LINK-call_received_by-001",
      "employee_user_id": "LINK-employee_user_id-001",
      "medium": "Sample Medium",
      "start_time": "2024-01-15T10:30:00.000Z",
      "end_time": "2024-01-15T10:30:00.000Z",
      "type": "Incoming",
      "customer": "LINK-customer-001",
      "status": "Ringing",
      "duration": 3600,
      "recording_url": "Sample Recording URL",
      "recording_html": "Sample text for recording_html",
      "type_of_call": "LINK-type_of_call-001",
      "summary": "Sample text for summary"
  };

  it('validates a correct Call Log object', () => {
    const result = CallLogSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CallLogInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CallLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
