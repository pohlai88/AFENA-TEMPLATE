import { describe, it, expect } from 'vitest';
import { SmsCenterSchema, SmsCenterInsertSchema } from '../types/sms-center.js';

describe('SmsCenter Zod validation', () => {
  const validSample = {
      "id": "TEST-SmsCenter-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "send_to": "All Contact",
      "customer": "LINK-customer-001",
      "supplier": "LINK-supplier-001",
      "sales_partner": "LINK-sales_partner-001",
      "department": "LINK-department-001",
      "branch": "LINK-branch-001",
      "receiver_list": "console.log(\"hello\");",
      "message": "Sample text for message",
      "total_characters": 1,
      "total_messages": 1
  };

  it('validates a correct SMS Center object', () => {
    const result = SmsCenterSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SmsCenterInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "message" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).message;
    const result = SmsCenterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SmsCenterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
