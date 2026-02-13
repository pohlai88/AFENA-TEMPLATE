import { describe, it, expect } from 'vitest';
import { SubscriptionInvoiceSchema, SubscriptionInvoiceInsertSchema } from '../types/subscription-invoice.js';

describe('SubscriptionInvoice Zod validation', () => {
  const validSample = {
      "id": "TEST-SubscriptionInvoice-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "document_type": "LINK-document_type-001",
      "invoice": "LINK-invoice-001"
  };

  it('validates a correct Subscription Invoice object', () => {
    const result = SubscriptionInvoiceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubscriptionInvoiceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubscriptionInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
