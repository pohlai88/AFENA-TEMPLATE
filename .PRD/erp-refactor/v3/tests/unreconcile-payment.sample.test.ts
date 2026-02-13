import { describe, it, expect } from 'vitest';
import { UnreconcilePaymentSchema, UnreconcilePaymentInsertSchema } from '../types/unreconcile-payment.js';

describe('UnreconcilePayment Zod validation', () => {
  const validSample = {
      "id": "TEST-UnreconcilePayment-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "company": "LINK-company-001",
      "voucher_type": "LINK-voucher_type-001",
      "voucher_no": "LINK-voucher_no-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Unreconcile Payment object', () => {
    const result = UnreconcilePaymentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = UnreconcilePaymentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = UnreconcilePaymentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
