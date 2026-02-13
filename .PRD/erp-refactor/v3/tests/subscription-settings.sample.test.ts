import { describe, it, expect } from 'vitest';
import { SubscriptionSettingsSchema, SubscriptionSettingsInsertSchema } from '../types/subscription-settings.js';

describe('SubscriptionSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-SubscriptionSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "grace_period": "1",
      "cancel_after_grace": "0",
      "prorate": "1"
  };

  it('validates a correct Subscription Settings object', () => {
    const result = SubscriptionSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubscriptionSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubscriptionSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
