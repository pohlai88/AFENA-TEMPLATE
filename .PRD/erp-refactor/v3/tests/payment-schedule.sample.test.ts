import { describe, it, expect } from 'vitest';
import { PaymentScheduleSchema, PaymentScheduleInsertSchema } from '../types/payment-schedule.js';

describe('PaymentSchedule Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentSchedule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "payment_term": "LINK-payment_term-001",
      "description": "Sample text for description",
      "due_date": "2024-01-15",
      "invoice_portion": 1,
      "mode_of_payment": "LINK-mode_of_payment-001",
      "due_date_based_on": "Day(s) after invoice date",
      "credit_days": 1,
      "credit_months": 1,
      "discount_date": "2024-01-15",
      "discount": 1,
      "discount_type": "Percentage",
      "discount_validity_based_on": "Day(s) after invoice date",
      "discount_validity": 1,
      "payment_amount": 100,
      "outstanding": 100,
      "paid_amount": 100,
      "discounted_amount": "0",
      "base_payment_amount": 100,
      "base_outstanding": 100,
      "base_paid_amount": 100
  };

  it('validates a correct Payment Schedule object', () => {
    const result = PaymentScheduleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentScheduleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "due_date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).due_date;
    const result = PaymentScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
