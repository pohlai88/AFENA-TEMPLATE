import { describe, it, expect } from 'vitest';
import { VoiceCallSettingsSchema, VoiceCallSettingsInsertSchema } from '../types/voice-call-settings.js';

describe('VoiceCallSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-VoiceCallSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "user": "LINK-user-001",
      "call_receiving_device": "Computer",
      "greeting_message": "Sample Greeting Message",
      "agent_busy_message": "Sample Agent Busy Message",
      "agent_unavailable_message": "Sample Agent Unavailable Message"
  };

  it('validates a correct Voice Call Settings object', () => {
    const result = VoiceCallSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = VoiceCallSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "user" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).user;
    const result = VoiceCallSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = VoiceCallSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
