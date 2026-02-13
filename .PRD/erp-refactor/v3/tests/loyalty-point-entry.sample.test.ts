import { describe, it, expect } from 'vitest';
import { LoyaltyPointEntrySchema, LoyaltyPointEntryInsertSchema } from '../types/loyalty-point-entry.js';

describe('LoyaltyPointEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-LoyaltyPointEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "loyalty_program": "LINK-loyalty_program-001",
      "loyalty_program_tier": "Sample Loyalty Program Tier",
      "customer": "LINK-customer-001",
      "invoice_type": "LINK-invoice_type-001",
      "invoice": "LINK-invoice-001",
      "redeem_against": "LINK-redeem_against-001",
      "loyalty_points": 1,
      "purchase_amount": 100,
      "expiry_date": "2024-01-15",
      "posting_date": "2024-01-15",
      "company": "LINK-company-001",
      "discretionary_reason": "Sample Discretionary Reason"
  };

  it('validates a correct Loyalty Point Entry object', () => {
    const result = LoyaltyPointEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LoyaltyPointEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "loyalty_program" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).loyalty_program;
    const result = LoyaltyPointEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LoyaltyPointEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
