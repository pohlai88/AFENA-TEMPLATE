import { describe, it, expect } from 'vitest';
import { SubscriptionPlanSchema, SubscriptionPlanInsertSchema } from '../types/subscription-plan.js';

describe('SubscriptionPlan Zod validation', () => {
  const validSample = {
      "id": "TEST-SubscriptionPlan-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "plan_name": "Sample Plan Name",
      "currency": "LINK-currency-001",
      "item": "LINK-item-001",
      "price_determination": "Fixed Rate",
      "cost": 100,
      "price_list": "LINK-price_list-001",
      "billing_interval": "Day",
      "billing_interval_count": "1",
      "product_price_id": "Sample Product Price ID",
      "payment_gateway": "LINK-payment_gateway-001",
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Subscription Plan object', () => {
    const result = SubscriptionPlanSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubscriptionPlanInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "plan_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).plan_name;
    const result = SubscriptionPlanSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubscriptionPlanSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
