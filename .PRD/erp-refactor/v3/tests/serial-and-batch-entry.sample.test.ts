import { describe, it, expect } from 'vitest';
import { SerialAndBatchEntrySchema, SerialAndBatchEntryInsertSchema } from '../types/serial-and-batch-entry.js';

describe('SerialAndBatchEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-SerialAndBatchEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "serial_no": "LINK-serial_no-001",
      "batch_no": "LINK-batch_no-001",
      "item_code": "LINK-item_code-001",
      "qty": "1",
      "warehouse": "LINK-warehouse-001",
      "delivered_qty": "0",
      "incoming_rate": 1,
      "outgoing_rate": 1,
      "stock_value_difference": 1,
      "is_outward": "0",
      "stock_queue": "Sample text for stock_queue",
      "reference_for_reservation": "Sample Reference for Reservation",
      "voucher_type": "Sample Voucher Type",
      "voucher_no": "Sample Voucher No",
      "is_cancelled": "0",
      "posting_datetime": "2024-01-15T10:30:00.000Z",
      "type_of_transaction": "Sample Type of Transaction",
      "voucher_detail_no": "Sample Voucher Detail No"
  };

  it('validates a correct Serial and Batch Entry object', () => {
    const result = SerialAndBatchEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SerialAndBatchEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SerialAndBatchEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
