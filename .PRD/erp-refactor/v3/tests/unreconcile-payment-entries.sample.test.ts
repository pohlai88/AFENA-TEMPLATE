import { describe, it, expect } from 'vitest';
import { UnreconcilePaymentEntriesSchema, UnreconcilePaymentEntriesInsertSchema } from '../types/unreconcile-payment-entries.js';

describe('UnreconcilePaymentEntries Zod validation', () => {
  const validSample = {
      "id": "TEST-UnreconcilePaymentEntries-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account": "Sample Account",
      "party_type": "Sample Party Type",
      "party": "Sample Party",
      "reference_doctype": "LINK-reference_doctype-001",
      "reference_name": "LINK-reference_name-001",
      "allocated_amount": 100,
      "account_currency": "LINK-account_currency-001",
      "unlinked": "0"
  };

  it('validates a correct Unreconcile Payment Entries object', () => {
    const result = UnreconcilePaymentEntriesSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = UnreconcilePaymentEntriesInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = UnreconcilePaymentEntriesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
