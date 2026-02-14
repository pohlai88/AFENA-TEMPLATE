import { describe, it, expect } from 'vitest';
import { LoyaltyPointEntryRedemptionSchema, LoyaltyPointEntryRedemptionInsertSchema } from '../types/loyalty-point-entry-redemption.js';

describe('LoyaltyPointEntryRedemption Zod validation', () => {
  const validSample = {
      "id": "TEST-LoyaltyPointEntryRedemption-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "sales_invoice": "Sample Sales Invoice",
      "redemption_date": "2024-01-15",
      "redeemed_points": 1
  };

  it('validates a correct Loyalty Point Entry Redemption object', () => {
    const result = LoyaltyPointEntryRedemptionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LoyaltyPointEntryRedemptionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LoyaltyPointEntryRedemptionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
