import { describe, it, expect } from 'vitest';
import { ProcessPeriodClosingVoucherSchema, ProcessPeriodClosingVoucherInsertSchema } from '../types/process-period-closing-voucher.js';

describe('ProcessPeriodClosingVoucher Zod validation', () => {
  const validSample = {
      "id": "TEST-ProcessPeriodClosingVoucher-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "parent_pcv": "LINK-parent_pcv-001",
      "status": "Queued",
      "p_l_closing_balance": {},
      "bs_closing_balance": {},
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Process Period Closing Voucher object', () => {
    const result = ProcessPeriodClosingVoucherSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProcessPeriodClosingVoucherInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "parent_pcv" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).parent_pcv;
    const result = ProcessPeriodClosingVoucherSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProcessPeriodClosingVoucherSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
