import { describe, it, expect } from 'vitest';
import { IncomingCallSettingsSchema, IncomingCallSettingsInsertSchema } from '../types/incoming-call-settings.js';

describe('IncomingCallSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-IncomingCallSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "call_routing": "Sequential",
      "greeting_message": "Sample Greeting Message",
      "agent_busy_message": "Sample Agent Busy Message",
      "agent_unavailable_message": "Sample Agent Unavailable Message"
  };

  it('validates a correct Incoming Call Settings object', () => {
    const result = IncomingCallSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = IncomingCallSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "call_handling_schedule" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).call_handling_schedule;
    const result = IncomingCallSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = IncomingCallSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
