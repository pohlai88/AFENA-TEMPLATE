import { describe, it, expect } from 'vitest';
import { SubscriptionPlanDetailSchema, SubscriptionPlanDetailInsertSchema } from '../types/subscription-plan-detail.js';

describe('SubscriptionPlanDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-SubscriptionPlanDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "plan": "LINK-plan-001",
      "qty": 1
  };

  it('validates a correct Subscription Plan Detail object', () => {
    const result = SubscriptionPlanDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubscriptionPlanDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "plan" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).plan;
    const result = SubscriptionPlanDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubscriptionPlanDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
