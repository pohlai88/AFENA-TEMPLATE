import { describe, it, expect } from 'vitest';
import { DeliverySettingsSchema, DeliverySettingsInsertSchema } from '../types/delivery-settings.js';

describe('DeliverySettings Zod validation', () => {
  const validSample = {
      "id": "TEST-DeliverySettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "dispatch_template": "LINK-dispatch_template-001",
      "dispatch_attachment": "LINK-dispatch_attachment-001",
      "send_with_attachment": "0",
      "stop_delay": 1
  };

  it('validates a correct Delivery Settings object', () => {
    const result = DeliverySettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DeliverySettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DeliverySettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
