import { describe, it, expect } from 'vitest';
import { CouponCodeSchema, CouponCodeInsertSchema } from '../types/coupon-code.js';

describe('CouponCode Zod validation', () => {
  const validSample = {
      "id": "TEST-CouponCode-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "coupon_name": "Sample Coupon Name",
      "coupon_type": "Promotional",
      "customer": "LINK-customer-001",
      "coupon_code": "Sample Coupon Code",
      "from_external_ecomm_platform": "0",
      "pricing_rule": "LINK-pricing_rule-001",
      "valid_from": "2024-01-15",
      "valid_upto": "2024-01-15",
      "maximum_use": 1,
      "used": "0",
      "description": "Sample text for description",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Coupon Code object', () => {
    const result = CouponCodeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CouponCodeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "coupon_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).coupon_name;
    const result = CouponCodeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CouponCodeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
