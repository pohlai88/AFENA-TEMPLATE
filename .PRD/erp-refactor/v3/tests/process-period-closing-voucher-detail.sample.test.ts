import { describe, it, expect } from 'vitest';
import { ProcessPeriodClosingVoucherDetailSchema, ProcessPeriodClosingVoucherDetailInsertSchema } from '../types/process-period-closing-voucher-detail.js';

describe('ProcessPeriodClosingVoucherDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-ProcessPeriodClosingVoucherDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "processing_date": "2024-01-15",
      "report_type": "Profit and Loss",
      "status": "Queued",
      "closing_balance": {}
  };

  it('validates a correct Process Period Closing Voucher Detail object', () => {
    const result = ProcessPeriodClosingVoucherDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProcessPeriodClosingVoucherDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProcessPeriodClosingVoucherDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
