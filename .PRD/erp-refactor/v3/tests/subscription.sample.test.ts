import { describe, it, expect } from 'vitest';
import { SubscriptionSchema, SubscriptionInsertSchema } from '../types/subscription.js';

describe('Subscription Zod validation', () => {
  const validSample = {
      "id": "TEST-Subscription-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "company": "LINK-company-001",
      "status": "Trialing",
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "cancelation_date": "2024-01-15",
      "trial_period_start": "2024-01-15",
      "trial_period_end": "2024-01-15",
      "follow_calendar_months": "0",
      "generate_new_invoices_past_due_date": "0",
      "submit_invoice": "1",
      "current_invoice_start": "2024-01-15",
      "current_invoice_end": "2024-01-15",
      "days_until_due": "0",
      "generate_invoice_at": "End of the current subscription period",
      "number_of_days": 1,
      "cancel_at_period_end": "0",
      "sales_tax_template": "LINK-sales_tax_template-001",
      "purchase_tax_template": "LINK-purchase_tax_template-001",
      "apply_additional_discount": "Grand Total",
      "additional_discount_percentage": 1,
      "additional_discount_amount": 100,
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Subscription object', () => {
    const result = SubscriptionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubscriptionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "party_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).party_type;
    const result = SubscriptionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubscriptionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
