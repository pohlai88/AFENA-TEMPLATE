import { describe, it, expect } from 'vitest';
import { EmailDigestRecipientSchema, EmailDigestRecipientInsertSchema } from '../types/email-digest-recipient.js';

describe('EmailDigestRecipient Zod validation', () => {
  const validSample = {
      "id": "TEST-EmailDigestRecipient-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "recipient": "LINK-recipient-001"
  };

  it('validates a correct Email Digest Recipient object', () => {
    const result = EmailDigestRecipientSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = EmailDigestRecipientInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "recipient" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).recipient;
    const result = EmailDigestRecipientSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = EmailDigestRecipientSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
