import { describe, it, expect } from 'vitest';
import { SerialAndBatchBundleSchema, SerialAndBatchBundleInsertSchema } from '../types/serial-and-batch-bundle.js';

describe('SerialAndBatchBundle Zod validation', () => {
  const validSample = {
      "id": "TEST-SerialAndBatchBundle-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "SABB-.########",
      "company": "LINK-company-001",
      "item_name": "Sample Item Name",
      "has_serial_no": "0",
      "has_batch_no": "0",
      "item_code": "LINK-item_code-001",
      "warehouse": "LINK-warehouse-001",
      "type_of_transaction": "Inward",
      "total_qty": 1,
      "item_group": "LINK-item_group-001",
      "avg_rate": 1,
      "total_amount": 1,
      "voucher_type": "LINK-voucher_type-001",
      "voucher_no": "LINK-voucher_no-001",
      "voucher_detail_no": "Sample Voucher Detail No",
      "posting_datetime": "2024-01-15T10:30:00.000Z",
      "returned_against": "Sample Returned Against",
      "is_cancelled": "0",
      "is_packed": "0",
      "is_rejected": "0",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Serial and Batch Bundle object', () => {
    const result = SerialAndBatchBundleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SerialAndBatchBundleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = SerialAndBatchBundleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SerialAndBatchBundleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
