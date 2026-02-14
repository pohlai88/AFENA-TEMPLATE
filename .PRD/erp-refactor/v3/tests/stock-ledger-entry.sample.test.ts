import { describe, it, expect } from 'vitest';
import { StockLedgerEntrySchema, StockLedgerEntryInsertSchema } from '../types/stock-ledger-entry.js';

describe('StockLedgerEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-StockLedgerEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "warehouse": "LINK-warehouse-001",
      "posting_date": "2024-01-15",
      "posting_time": "10:30:00",
      "posting_datetime": "2024-01-15T10:30:00.000Z",
      "is_adjustment_entry": "0",
      "auto_created_serial_and_batch_bundle": "0",
      "voucher_type": "LINK-voucher_type-001",
      "voucher_no": "LINK-voucher_no-001",
      "voucher_detail_no": "Sample Voucher Detail No",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "dependant_sle_voucher_detail_no": "Sample Dependant SLE Voucher Detail No",
      "recalculate_rate": "0",
      "actual_qty": 1,
      "qty_after_transaction": 1,
      "incoming_rate": 100,
      "outgoing_rate": 100,
      "valuation_rate": 100,
      "stock_value": 100,
      "stock_value_difference": 100,
      "stock_queue": "Sample text for stock_queue",
      "company": "LINK-company-001",
      "stock_uom": "LINK-stock_uom-001",
      "project": "LINK-project-001",
      "fiscal_year": "Sample Fiscal Year",
      "has_batch_no": "0",
      "has_serial_no": "0",
      "is_cancelled": "0",
      "to_rename": "1",
      "serial_no": "Sample text for serial_no",
      "batch_no": "Sample Batch No"
  };

  it('validates a correct Stock Ledger Entry object', () => {
    const result = StockLedgerEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockLedgerEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockLedgerEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
