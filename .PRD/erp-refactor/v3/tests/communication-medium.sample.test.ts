import { describe, it, expect } from 'vitest';
import { CommunicationMediumSchema, CommunicationMediumInsertSchema } from '../types/communication-medium.js';

describe('CommunicationMedium Zod validation', () => {
  const validSample = {
      "id": "TEST-CommunicationMedium-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "communication_channel": "Option1",
      "communication_medium_type": "Voice",
      "catch_all": "LINK-catch_all-001",
      "provider": "LINK-provider-001",
      "disabled": "0"
  };

  it('validates a correct Communication Medium object', () => {
    const result = CommunicationMediumSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CommunicationMediumInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "communication_medium_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).communication_medium_type;
    const result = CommunicationMediumSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CommunicationMediumSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
